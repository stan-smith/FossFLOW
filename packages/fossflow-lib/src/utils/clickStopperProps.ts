export const clickStopperProps = {
    onMouseDown: (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation(),
    onContextMenu: (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()
}