/**
 * @typedef {import('../../../types/agendaItem.js').AgendaItem} AgendaItem
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgenda } from '../../../logic/hooks.js';
import ConfirmDialog from '../ConfirmDialog.jsx';

/**
 * @typedef {Object} AgendaItemActionsProps
 * @property {AgendaItem} item - Item
 * @property {Function} [onAction] - Callback dopo azione
 */

export default function AgendaItemActions({ item, onAction }) {
  const navigate = useNavigate();
  const { toggleComplete, deleteItem } = useAgenda();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleToggleComplete = () => {
    toggleComplete(item.id);
    if (onAction) onAction();
  };

  const handleEdit = () => {
    navigate(`/edit/${item.id}`);
    if (onAction) onAction();
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    deleteItem(item.id);
    if (onAction) onAction();
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleComplete();
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-success/10 hover:bg-success/20 border border-success/20 transition-colors active:scale-95"
        title={item.status === 'PENDING' ? 'Segna come completato' : 'Riapri'}
        aria-label={item.status === 'PENDING' ? 'Segna come completato' : 'Riapri'}
      >
        {item.status === 'PENDING' ? (
          <span className="material-symbols-outlined text-success text-[16px]">check</span>
        ) : (
          <span className="material-symbols-outlined text-success text-[16px]">arrow_back</span>
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEdit();
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors active:scale-95"
        title="Modifica"
        aria-label="Modifica"
      >
        <span className="material-symbols-outlined text-primary text-[16px]">edit</span>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="w-8 h-8 rounded-full flex items-center justify-center bg-danger/10 hover:bg-danger/20 border border-danger/20 transition-colors active:scale-95"
        title="Elimina"
        aria-label="Elimina"
      >
        <span className="material-symbols-outlined text-danger text-[16px]">delete</span>
      </button>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={confirmDelete}
        title="Conferma Eliminazione"
        message={`Sei sicuro di voler eliminare "${item.title}"?`}
        variant="danger"
      />
    </div>
  );
}
