import { GridTable } from 'components/grid-table';
import { Row } from 'components/row';
import { ITimeTrackingModel, IUserModel } from 'hooks';
import { useLookup } from 'store/hooks';
import styled from 'styled-components';

import { timeLogColumns } from './constants';

export interface ITimeLogTableProps {
  data: ITimeTrackingModel[];
  totalTime: number;
}

const TableContainer = styled.div`
  div[role='table'] {
    width: 550px;
  }
  .total-text {
    font-weight: 700;
    margin-top: 1%;
    margin-left: 1%;
  }
`;

export const TimeLogTable: React.FC<ITimeLogTableProps> = ({ data, totalTime }) => {
  const [{ users }] = useLookup();
  console.log(data);
  const parsedData = data.map((d: ITimeTrackingModel) => ({
    userName: users.find((u) => u.id === d.userId)?.displayName,
    userId: d.userId,
    activity: d.activity,
    effort: `${d.effort} Min`,
    contentId: d.contentId,
    createdOn: d.createdOn,
  }));
  return (
    <TableContainer>
      <GridTable
        paging={{ showPaging: false }}
        columns={timeLogColumns}
        data={parsedData!!}
      ></GridTable>
      <Row>
        <p className="total-text">{`Total: ${totalTime} Min`}</p>
      </Row>
    </TableContainer>
  );
};
