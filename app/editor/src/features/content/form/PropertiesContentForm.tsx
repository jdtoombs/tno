import {
  Button,
  Col,
  FormikCheckbox,
  FormikDropdown,
  FormikText,
  FormikTextArea,
  RadioGroup,
  Row,
  SelectDate,
} from 'components';

import { expireOptions, summaryOptions, toningOptions } from './constants';

export const PropertiesContentForm: React.FC = () => {
  return (
    <Col style={{ margin: '3%' }}>
      <Row>
        <Col>
          <Row>
            <FormikDropdown name="series" label="Series" />
            <FormikText name="otherSeries" label="Other Series" />
          </Row>
          <Row>
            <FormikDropdown name="eod" label="EoD Category" />
            <FormikDropdown name="score" label="Score" />
          </Row>
          <Row>
            <FormikText name="date" label="Date" onChange={() => console.log('here')} />
            <FormikText name="time" label="Time" />
          </Row>
          <Row>
            <FormikText name="page" label="Page" />
          </Row>
        </Col>
        <Col>
          <RadioGroup name="test" options={expireOptions} />
        </Col>
        <Col>
          <FormikCheckbox name="otherSnippet" label="Other Snippet" labelRight />
        </Col>
      </Row>
      <Row>
        <RadioGroup direction="row" name="test" options={summaryOptions} />
      </Row>
      <Row>
        <FormikTextArea
          name="summary"
          label="Summary"
          style={{ width: '800px', height: '400px' }}
        />
      </Row>
      <Row>
        <RadioGroup label="Toning" direction="row" name="toning" options={toningOptions} />
      </Row>
      <Row>
        <Button>Attach File</Button>
        <Button>Remove File</Button>
      </Row>
      <Row>
        <FormikText name="prep" label="Prep Time" />
        <Button>Add</Button>
        <FormikText name="total" label="Total" />
        <Button>View Log</Button>
      </Row>
    </Col>
  );
};
