import { FC, useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';
import './styles.scss';
import { Tooltip } from 'primereact/tooltip';
import {
  Menu, Item, Separator, Submenu, useContextMenu,
} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export const ItemTypes = {
  CARD: 'card',
};

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

export interface CardProps {
  id: any
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

const ContentItem: FC<CardProps> = ({
  id, index, moveCard, children, onEdit, onDelete,
}) => {
  const menuId = `item-${id}`;
  const { show } = useContextMenu({
    id: menuId,
  });
  function handleContextMenu(event: any) {
    event.preventDefault();
    show(event, {
      props: {
        key: 'value',
      },
    });
  }

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => ({ id, index }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div onContextMenu={handleContextMenu} className={`drag-item drag-item-${index}`} ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <Menu id={menuId}>
        <Item onClick={() => onEdit(id)}>Editar</Item>
        <Item onClick={() => onDelete(id)}>Deletar</Item>
      </Menu>
      <Tooltip target={`.drag-item-${index}`} content="Arraste e solte para mudar a ordem, clique com o botão direito para editar ou remover." />
      {children}
    </div>
  );
};

export default ContentItem;
