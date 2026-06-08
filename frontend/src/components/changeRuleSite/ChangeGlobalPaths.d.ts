interface ChangeGlobalPathsProps {
    globalPaths: string[];
    onDeleteClick: (index: number) => void;
    onEditClick: (index: number, newPath: string) => void;
    onAddClick: (newPath: string) => void;
}
export declare function ChangeGlobalPaths({ globalPaths, onDeleteClick, onEditClick, onAddClick }: ChangeGlobalPathsProps): import("react").JSX.Element;
export {};
