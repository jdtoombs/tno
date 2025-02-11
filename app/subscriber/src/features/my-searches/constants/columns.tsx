import { FaBinoculars, FaBookmark, FaTrash } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';
import { FiSave } from 'react-icons/fi';
import { IFilterModel, ITableHookColumn, Row, Text } from 'tno-core';

export const columns = (
  setActive: (folder: IFilterModel) => void,
  editable: string,
  handleSave: () => void,
  handleDelete: () => void,
  setViewing: (folder: IFilterModel) => void,
  active?: IFilterModel,
): ITableHookColumn<IFilterModel>[] => [
  {
    label: 'Search Name',
    accessor: 'name',
    cell: (cell) => (
      <Row>
        <FaBookmark className="darker-icon" />
        {active && editable === cell.original.name ? (
          <Text
            className="re-name"
            name="name"
            value={active.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setActive({ ...active, name: e.target.value });
            }}
            key={active.id}
          />
        ) : (
          cell.original.name
        )}
      </Row>
    ),
  },
  {
    label: '',
    accessor: 'options',
    cell: (cell) => (
      <>
        {editable === cell.original.name ? (
          <FiSave
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className="elips"
          />
        ) : (
          <div className="search-row-options">
            {/* upcoming sprint these are used */}
            <FaBinoculars
              data-tooltip-id="binocs"
              className="darker-icon"
              onClick={(e) => {
                e.stopPropagation();
                setViewing(cell.original);
              }}
            />
            <FaGear
              onClick={(e) => {
                // stop the row click event from firing
                e.stopPropagation();
                setActive(cell.original);
              }}
              data-tooltip-id="modify"
              className="gear"
            />
            <FaTrash
              className="trash"
              data-tooltip-id="delete"
              onClick={(e) => {
                e.stopPropagation();
                setActive(cell.original);
                handleDelete();
              }}
            />
          </div>
        )}
      </>
    ),
  },
];
