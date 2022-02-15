import * as styled from './AreaStyled';

export interface IAreaProps {
  children?: React.ReactNode;
}

export const Area: React.FC<any> = ({ children }) => {
  return <styled.Area>{children}</styled.Area>;
};
