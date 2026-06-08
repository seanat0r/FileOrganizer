import {useState} from "react";

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

    const handleAdd = () => {
        if (newPathInput.trim() !== "") {
            onAddClick(newPathInput.trim());
            setNewPathInput("");
        }
    };

    const startEditing = (index: number, currentPath: string) => {
        setEditingIndex(index);
        setEditValue(currentPath);
    };

    const saveEdit = (index: number) => {
        if (editValue.trim() !== "") {
            onEditClick(index, editValue.trim());
        }
        setEditingIndex(null);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
    };

    return (
        <section className="global-paths-editor card">
            <div className="card-header">
                <h3>Global Watch Directories</h3>
            </div>

            <div className="path-list-container">
                {globalPaths.length === 0 ? (
                    <div className="empty-state-text">No global paths configured.</div>
                ) : (
                    <ul className="path-list">
                        {globalPaths.map((path, index) => (
                            <li key={index} className="path-list-item">
                                {editingIndex === index ? (
                                    /* --- EDIT MODUS --- */
                                    <div className="path-edit-mode">
                                        <input
                                            type="text"
                                            className="form-input flex-grow"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") saveEdit(index);
                                                if (e.key === "Escape") cancelEdit();
                                            }}
                                        />
                                        <div className="action-buttons">
                                            <button className="btn-primary btn-small"
                                                    onClick={() => saveEdit(index)}>Save
                                            </button>
                                            <button className="btn-secondary btn-small" onClick={cancelEdit}>Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* --- NORMAL MODUS --- */
                                    <div className="path-view-mode">
                                        <span className="path-text">{path}</span>
                                        <div className="action-buttons">
                                            <button className="btn-secondary btn-small"
                                                    onClick={() => startEditing(index, path)}>Edit
                                            </button>
                                            <button className="btn-danger btn-small"
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

            <div className="add-path-controls">
                <input
                    type="text"
                    className="form-input flex-grow"
                    placeholder="Mac/Linux: /home/user | Windows: C:\Users\name"
                    value={newPathInput}
                    onChange={(e) => setNewPathInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdd();
                    }}
                />
                <button className="btn-primary" onClick={handleAdd}>Add Path</button>
            </div>
        </section>
    );
}