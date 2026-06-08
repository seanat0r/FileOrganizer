import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export function ChangeGlobalPaths({ globalPaths, onDeleteClick, onEditClick, onAddClick }) {
    const [newPathInput, setNewPathInput] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const handleAdd = () => {
        if (newPathInput.trim() !== "") {
            onAddClick(newPathInput.trim());
            setNewPathInput("");
        }
    };
    const startEditing = (index, currentPath) => {
        setEditingIndex(index);
        setEditValue(currentPath);
    };
    const saveEdit = (index) => {
        if (editValue.trim() !== "") {
            onEditClick(index, editValue.trim());
        }
        setEditingIndex(null);
    };
    const cancelEdit = () => {
        setEditingIndex(null);
    };
    return (_jsxs("section", { className: "global-paths-editor card", children: [_jsx("div", { className: "card-header", children: _jsx("h3", { children: "Global Watch Directories" }) }), _jsx("div", { className: "path-list-container", children: globalPaths.length === 0 ? (_jsx("div", { className: "empty-state-text", children: "No global paths configured." })) : (_jsx("ul", { className: "path-list", children: globalPaths.map((path, index) => (_jsx("li", { className: "path-list-item", children: editingIndex === index ? (_jsxs("div", { className: "path-edit-mode", children: [_jsx("input", { type: "text", className: "form-input flex-grow", value: editValue, onChange: (e) => setEditValue(e.target.value), autoFocus: true, onKeyDown: (e) => {
                                        if (e.key === "Enter")
                                            saveEdit(index);
                                        if (e.key === "Escape")
                                            cancelEdit();
                                    } }), _jsxs("div", { className: "action-buttons", children: [_jsx("button", { className: "btn-primary btn-small", onClick: () => saveEdit(index), children: "Save" }), _jsx("button", { className: "btn-secondary btn-small", onClick: cancelEdit, children: "Cancel" })] })] })) : (_jsxs("div", { className: "path-view-mode", children: [_jsx("span", { className: "path-text", children: path }), _jsxs("div", { className: "action-buttons", children: [_jsx("button", { className: "btn-secondary btn-small", onClick: () => startEditing(index, path), children: "Edit" }), _jsx("button", { className: "btn-danger btn-small", onClick: () => onDeleteClick(index), children: "Del" })] })] })) }, index))) })) }), _jsxs("div", { className: "add-path-controls", children: [_jsx("input", { type: "text", className: "form-input flex-grow", placeholder: "Mac/Linux: /home/user | Windows: C:\\Users\\name", value: newPathInput, onChange: (e) => setNewPathInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === "Enter")
                                handleAdd();
                        } }), _jsx("button", { className: "btn-primary", onClick: handleAdd, children: "Add Path" })] })] }));
}
