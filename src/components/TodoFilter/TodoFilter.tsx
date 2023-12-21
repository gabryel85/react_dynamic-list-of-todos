import {FilterT, useTodos} from '../../context/TodoProvider';

export const TodoFilter = () => {
  const { query, setQuery } = useTodos();

  return (
    <form className="field has-addons">
      <p className="control">
        <span className="select">
          <select
            value={query.option}
            onChange={e => setQuery((prev: FilterT) => ({
              ...prev,
              option: e.target.value,
            }))}
            data-cy="statusSelect"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </span>
      </p>

      <p className="control is-expanded has-icons-left has-icons-right">
        <input
          data-cy="searchInput"
          type="text"
          className="input"
          placeholder="Search..."
          value={query.value}
          onChange={e => setQuery((prev: any) => ({
            ...prev,
            value: e.target.value,
          }))}
        />
        <span className="icon is-left">
          <i className="fas fa-magnifying-glass" />
        </span>

        <span className="icon is-right" style={{ pointerEvents: 'all' }}>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            data-cy="clearSearchButton"
            type="button"
            className="delete"
          />
        </span>
      </p>
    </form>
  );
};
