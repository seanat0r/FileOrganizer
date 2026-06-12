import {useState} from "react";
import {isValidPath} from "../../utils/checkValidPath.ts";

interface ChangeGlobalPathsProps {
    globalPaths: string[];
    onDeleteClick: (index: number) => void;
    onEditClick: (index: number, newPath: string) => void;
    onAddClick: (newPath: string) => void;
}

export function ChangeGlobalPaths({
                                      globalPaths,
                                      onDeleteClick,
                                      onEditClick,
                                      onAddClick
                                  }: ChangeGlobalPathsProps) {

    const [newPathInput, setNewPathInput] = useState<string>('');

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [editValue, setEditValue] = useState<string>('');

    const [pathError, setPathError] = useState<string | null>(null);

    const handleAdd = () => {
        const trimmedPath = newPathInput.trim();
        setPathError(null);

        if (trimmedPath === "") {
            setPathError("Path cannot be empty");
            return;
        }

        if (globalPaths.includes(trimmedPath)) {
            setPathError("Path already exists")
            return;
        }

        if (isValidPath(newPathInput)) {
            onAddClick(newPathInput.trim());
            setNewPathInput("");
        } else {
            setPathError("Cannot be a valid path. Enter full path (with / or C:\\).");
            return;
        }
    };

    const startEditing = (index: number, currentPath: string) => {
        setEditingIndex(index);
        setEditValue(currentPath);
    };

    const saveEdit = (index: number) => {
        setPathError(null);
        if (isValidPath(editValue)) {
            const trimmedEdit = editValue.trim();

            if (trimmedEdit === "") {
                cancelEdit();
                return;
            }

            if (isValidPath(editValue)) {
                onEditClick(index, trimmedEdit);
                return;
            } else {
                setPathError("Invalid path. Enter full path (with / or C:\\).");
            }
        }
        setEditingIndex(null);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
    };

    return (
        <section
            className="bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-5 sm:p-6 shadow-md min-w-0 w-full">
            <div
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-accent-blue/20 pb-4 mb-5 gap-3 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-text-primary truncate">Global Watch Directories</h3>
                {pathError && (
                    <div
                        className="flex items-center gap-2 bg-log-error/10 border border-log-error/30 text-log-error px-3 py-1.5 rounded-lg text-sm font-medium min-w-0">
                        <span className="shrink-0">⚠️</span>
                        <span className="truncate">{pathError}</span>
                    </div>
                )}
            </div>

            <div className="mb-6 min-w-0">
                {globalPaths.length === 0 ? (
                    <div className="bg-bg-base/50 border border-accent-blue/10 rounded-lg p-6 text-center">
                        <span className="text-text-secondary italic">No global paths configured.</span>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3 min-w-0">
                        {globalPaths.map((path, index) => (
                            <li key={index}
                                className="bg-bg-base border border-accent-blue/20 rounded-lg p-3 sm:p-4 min-w-0 transition-colors hover:border-accent-blue/40">
                                {editingIndex === index ? (
                                    /* --- EDIT MODUS --- */
                                    <div className="flex flex-col sm:flex-row gap-3 min-w-0">
                                        <input
                                            type="text"
                                            className="flex-1 bg-bg-surface border border-accent-blue focus:border-accent-blue outline-none rounded-md px-3 py-2 text-sm text-text-primary min-w-0"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(index);
                                                if (e.key === "Escape") cancelEdit();
                                            }}
                                        />
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                className="bg-accent-blue text-bg-base px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-blue/40"
                                                onClick={() => saveEdit(index)}>Save
                                            </button>
                                            <button
                                                className="bg-bg-surface border border-border text-text-secondary px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 hover:text-text-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-text-primary/10"
                                                onClick={cancelEdit}>Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* --- NORMAL MODUS --- */
                                    <div
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 min-w-0">
                                        <span className="text-sm font-mono text-text-primary break-all">{path}</span>
                                        <div className="flex gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                            <button
                                                className="flex-1 sm:flex-none bg-bg-surface border border-border text-text-primary px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-bg-hover hover:-translate-y-1 hover:shadow-lg hover:shadow-text-primary/10"
                                                onClick={() => startEditing(index, path)}>Edit
                                            </button>
                                            <button
                                                className="flex-1 sm:flex-none bg-log-error/10 text-log-error border border-log-error/20 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 hover:bg-log-error/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-log-error/30"
                                                onClick={() => onDeleteClick(index)}>Del
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="pt-4 border-t border-accent-blue/20 min-w-0">
                <div className="flex flex-col sm:flex-row gap-3 min-w-0 w-full">
                    <input
                        type="text"
                        className="flex-1 bg-bg-base border border-border focus:border-accent-blue outline-none rounded-lg px-4 py-2 text-sm text-text-primary min-w-0 placeholder:text-text-secondary/50"
                        placeholder="Mac/Linux: /home/user | Windows: C:\Users\name"
                        value={newPathInput}
                        onChange={(e) => setNewPathInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAdd();
                        }}
                    />
                    <button
                        className="bg-accent-blue text-text-primary px-6 py-2.5 rounded-lg text-sm font-bold transition-all
                        duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-blue/50 shrink-0"
                        onClick={handleAdd}>
                        Add Path
                    </button>
                </div>
            </div>
        </section>
    );
}