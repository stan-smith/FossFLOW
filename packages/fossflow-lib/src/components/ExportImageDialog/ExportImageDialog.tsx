import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  Stack,
  Alert,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material';
import { useModelStore } from 'src/stores/modelStore';
import {
  exportAsImage,
  downloadFile as downloadFileUtil,
  base64ToBlob,
  generateGenericFilename,
  modelFromModelStore
} from 'src/utils';
import { ModelStore } from 'src/types';
import { useDiagramUtils } from 'src/hooks/useDiagramUtils';
import { useUiStateStore } from 'src/stores/uiStateStore';
import { Isoflow } from 'src/Isoflow';
import { Loader } from 'src/components/Loader/Loader';
import { customVars } from 'src/styles/theme';
import { ColorPicker } from 'src/components/ColorSelector/ColorPicker';

interface Props {
  quality?: number;
  onClose: () => void;
}

export const ExportImageDialog = ({ onClose, quality = 1.5 }: Props) => {
  const containerRef = useRef<HTMLDivElement>();
  const debounceRef = useRef<NodeJS.Timeout>();
  const currentView = useUiStateStore((state) => {
    return state.view;
  });
  const [imageData, setImageData] = React.useState<string>();
  const [exportError, setExportError] = useState(false);
  const { getUnprojectedBounds } = useDiagramUtils();
  const uiStateActions = useUiStateStore((state) => {
    return state.actions;
  });
  const model = useModelStore((state): Omit<ModelStore, 'actions'> => {
    return modelFromModelStore(state);
  });

  const unprojectedBounds = useMemo(() => {
    return getUnprojectedBounds();
  }, [getUnprojectedBounds]);

  useEffect(() => {
    uiStateActions.setMode({
      type: 'INTERACTIONS_DISABLED',
      showCursor: false
    });
  }, [uiStateActions]);

  const exportImage = useCallback(async () => {
    if (!containerRef.current) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      exportAsImage(containerRef.current as HTMLDivElement)
        .then((data) => {
          return setImageData(data);
        })
        .catch((err) => {
          console.log(err);
          setExportError(true);
        });
    }, 2000);
  }, []);

  const downloadFile = useCallback(() => {
    if (!imageData) return;

    const data = base64ToBlob(
      imageData.replace('data:image/png;base64,', ''),
      'image/png;charset=utf-8'
    );

    downloadFileUtil(data, generateGenericFilename('png'));
  }, [imageData]);

  const [showGrid, setShowGrid] = useState(false);
  const handleShowGridChange = (checked: boolean) => {
    setShowGrid(checked);
  };

  const [backgroundColor, setBackgroundColor] = useState<string>(
    customVars.customPalette.diagramBg
  );
  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  useEffect(() => {
    setImageData(undefined);
  }, [showGrid, backgroundColor]);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Export as image</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="info">
            <strong>
              Certain browsers may not support exporting images properly.
            </strong>{' '}
            <br />
            For best results, please use the latest version of either Chrome or
            Firefox.
          </Alert>

          {!imageData && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  overflow: 'hidden'
                }}
              >
                <Box
                  ref={containerRef}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  style={{
                    width: unprojectedBounds.width * quality,
                    height: unprojectedBounds.height * quality
                  }}
                >
                  <Isoflow
                    editorMode="NON_INTERACTIVE"
                    onModelUpdated={exportImage}
                    initialData={{
                      ...model,
                      fitToView: true,
                      view: currentView
                    }}
                    renderer={{
                      showGrid,
                      backgroundColor
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  top: 0,
                  left: 0,
                  width: 500,
                  height: 300,
                  bgcolor: 'common.white'
                }}
              >
                <Loader size={2} />
              </Box>
            </>
          )}
          <Stack alignItems="center" spacing={2}>
            {imageData && (
              <Box
                component="img"
                sx={{
                  maxWidth: '100%'
                }}
                style={{
                  width: unprojectedBounds.width
                }}
                src={imageData}
                alt="preview"
              />
            )}
            <Box sx={{ width: '100%' }}>
              <Box component="fieldset">
                <Typography variant="caption" component="legend">
                  Options
                </Typography>

                <FormControlLabel
                  label="Show grid"
                  control={
                    <Checkbox
                      size="small"
                      checked={showGrid}
                      onChange={(event) => {
                        handleShowGridChange(event.target.checked);
                      }}
                    />
                  }
                />
                <FormControlLabel
                  label="Background color"
                  control={
                    <ColorPicker
                      value={backgroundColor}
                      onChange={handleBackgroundColorChange}
                    />
                  }
                />
              </Box>
            </Box>
            {imageData && (
              <Stack sx={{ width: '100%' }} alignItems="flex-end">
                <Stack direction="row" spacing={2}>
                  <Button variant="text" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={downloadFile}>Download as PNG</Button>
                </Stack>
              </Stack>
            )}
          </Stack>

          {exportError && (
            <Alert severity="error">Could not export image</Alert>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
