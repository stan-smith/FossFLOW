import React from 'react';
import { useScene } from 'src/hooks/useScene';
import { TextBox } from './TextBox';

interface Props {
  textBoxes: ReturnType<typeof useScene>['textBoxes'];
}

export const TextBoxes = ({ textBoxes }: Props) => {
  return (
    <>
      {[...textBoxes].reverse().map((textBox) => {
        return <TextBox key={textBox.id} textBox={textBox} />;
      })}
    </>
  );
};
