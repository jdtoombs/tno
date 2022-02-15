import { Button, Col, FormikTextArea, Row } from 'components';

export const TranscriptContentForm: React.FC = () => {
  return (
    <Col style={{ margin: '3%' }}>
      <Row>
        <FormikTextArea
          name="transcript"
          label="Transcript"
          style={{ width: '800px', height: '400px' }}
        />
      </Row>
      <Row>
        <Button>Auto Transcribe</Button>
      </Row>
    </Col>
  );
};
