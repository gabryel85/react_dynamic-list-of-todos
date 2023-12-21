import {
  createContext, FC, ReactNode, useContext, useMemo, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api';

type Props = {
  children: ReactNode;
};

type ErrorT = {
  message: string,
} | null;

export type FilterT = {
  value: string,
  option: string
};

type TodoProviderT = {
  pending: boolean;
  todos: Todo[],
  errors: ErrorT,
  getAllTodos: () => void,
  setCurrentTodo: (todo: Todo | null) => void,
  currentTodo: Todo | null,
  query: FilterT,
  setQuery: (query: FilterT | ((prev: FilterT) => FilterT)) => void;
};

const TodoContext = createContext<TodoProviderT>({
  pending: false,
  todos: [],
  errors: null,
  getAllTodos: () => {},
  setCurrentTodo: () => {},
  currentTodo: null,
  query: {
    value: '',
    option: 'all',
  },
  setQuery: () => {},
});

const TodoProvider: FC<Props> = ({ children }) => {
  const [pending, setPending] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errors, setErrors] = useState<ErrorT>(null);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState<FilterT>({
    value: '',
    option: 'all',
  });

  const getAllTodos = () => {
    setPending(true);
    getTodos()
      .then(data => {
        setTodos(data);
        setPending(false);
      })
      .catch(err => {
        setErrors({ message: err });
        setPending(false);
      });
  };

  const visibleTodos = useMemo(() => {
    return todos
      .filter(todo => {
        switch (query.option) {
          case 'active':
            return !todo.completed;
          case 'completed':
            return todo.completed;
          default:
            return true;
        }
      })
      .filter(todo => todo.title.includes(query.value));
  }, [query.value, query.option, todos]);

  const value = useMemo(() => ({
    pending,
    todos: visibleTodos,
    errors,
    getAllTodos,
    setCurrentTodo,
    currentTodo,
    query,
    setQuery,
  }), [pending, errors, todos, currentTodo, query]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;

export const useTodos = () => useContext(TodoContext);
