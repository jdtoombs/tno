import { Button, ButtonVariant } from 'components/button';
import { Col } from 'components/col';
import { IOptionItem, OptionItem, RadioGroup, SelectDate } from 'components/form';
import { FormikCheckbox, FormikDropdown, FormikText, FormikTextArea } from 'components/formik';
import { Modal } from 'components/modal/Modal';
import { Row } from 'components/row';
import { Upload } from 'components/upload';
import { useFormikContext } from 'formik';
import { ITimeTrackingModel } from 'hooks';
import useModal from 'hooks/modal/useModal';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useLookup } from 'store/hooks';
import { getSortableOptions } from 'utils';
import { string } from 'yup';

import { expireOptions, summaryOptions, toningOptions } from './constants';
import { IContentForm } from './interfaces';
import { TimeLogTable } from './TimeLogTable';

export interface IContentSubForms {
  setContent: (content: IContentForm) => void;
  content: IContentForm;
}

export const PropertiesContentForm: React.FC<IContentSubForms> = ({ setContent, content }) => {
  const [{ series: lSeries, categories }] = useLookup();
  const { values, setFieldValue } = useFormikContext<IContentForm>();
  const [tags, setTags] = React.useState<string[]>();

  const [categoryTypes, setCategoryTypes] = React.useState<IOptionItem[]>([]);

  React.useEffect(() => {
    setCategoryTypes(getSortableOptions(categories));
  }, [categories]);

  const { isShowing, toggle } = useModal();

  const [series, setSeries] = React.useState<IOptionItem[]>();

  const formatTime = (date: string) => {
    const converted = new Date(date);
    return !!converted.getTime() ? converted.getTime() : '';
  };

  React.useEffect(() => {
    setSeries(lSeries.map((m: any) => new OptionItem(m.name, m.id)));
  }, [lSeries]);

  const tagMatch = /(?<=\[).+?(?=\])/g;
  var result;
  const fakeTimeTrackings = [
    {
      userId: 1,
      activity: 'Working Hard',
      effort: '12',
      contentId: 8,
      createdOn: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
    },
    {
      userId: 2,
      activity: 'Debugging',
      effort: '2',
      contentId: 8,
      createdOn: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
    },
    {
      userId: 3,
      activity: 'Updating',
      effort: '2.34',
      contentId: 8,
      createdOn: new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
    },
  ];

  const getTotalTime = () => {
    let count = 0;
    fakeTimeTrackings.forEach((t: ITimeTrackingModel) => (count += Number(t.effort)));
    return count;
  };

  const [effort, setEffort] = React.useState(getTotalTime());

  React.useEffect(() => {
    if (content.summary) {
      result = content.summary.match(tagMatch)?.toString();
      console.log(result);
      setTags(result?.split(', '));
    }
  }, [content.summary]);

  return (
    <Col style={{ margin: '3%' }}>
      <Row>
        <Col>
          <Row>
            <FormikDropdown
              className="md"
              value={series && series.find((s: any) => s.value === values.seriesId)}
              onChange={(e: any) => {
                setContent({ ...content, seriesId: e.value });
                setFieldValue('seriesId', content.seriesId);
                console.log(values.seriesId);
              }}
              options={series}
              outerClassName="space-right"
              name="seriesId"
              label="Series"
            />
            <FormikText disabled className="md" name="otherSeries" label="Other Series" />
          </Row>
          <Row>
            <FormikDropdown
              outerClassName="space-right"
              className="md"
              name="categories"
              label="EoD Category"
              options={categoryTypes}
            />
            <FormikDropdown isDisabled className="md" name="score" label="Score" />
          </Row>
          <Row style={{ position: 'relative' }}>
            <Col>
              <SelectDate
                className="md-lrg"
                name="date"
                label="Date"
                selectedDate={values.publishedOn ?? ''}
                value={values.publishedOn}
                disabled
                onChange={(date: any) => {
                  setContent({ ...content, publishedOn: date });
                }}
              />
            </Col>
            <Col style={{ marginTop: '0.45em' }}>
              <FormikText
                disabled
                value={formatTime(values.publishedOn)}
                name="time"
                label="Time"
              />
            </Col>
          </Row>
          <Row>
            <FormikText
              name="page"
              label="Page"
              onChange={(e: any) => setContent({ ...content, page: e.target.value })}
            />
          </Row>
        </Col>
        <Row style={{ marginLeft: '10%', marginTop: '1%' }}>
          <Col>
            <RadioGroup
              spaceUnderRadio
              name="test"
              options={expireOptions}
              value={expireOptions.find((e) => e.value === values?.licenseId)}
              onChange={(e) => setContent({ ...content, licenseId: Number(e.target.value) })}
            />
          </Col>
          <Col>
            <FormikCheckbox
              disabled
              className="chk"
              name="otherSnippet"
              label="Other Snippet"
              labelRight
            />
          </Col>
        </Row>
      </Row>
      <Row>
        <RadioGroup
          disabled
          value={summaryOptions.find((x) => x.value === 0)}
          direction="row"
          name="test"
          options={summaryOptions}
        />
      </Row>
      <Row>
        <FormikTextArea
          name="summary"
          label="Summary"
          value={values.summary}
          onChange={(e: any) => setContent({ ...content, summary: e.target.value })}
          style={{ width: '1000px', height: '400px' }}
        />
      </Row>
      <Row>
        <FormikText disabled name="tags" label="Tags" value={tags && tags.join(', ')} />
        <Button
          variant={ButtonVariant.danger}
          style={{ marginTop: '1.16em' }}
          onClick={() => {
            const regex = /\[.*\]/;
            setContent({ ...content, summary: content.summary.replace(regex, '') });
            setTags([]);
          }}
        >
          Clear Tags
        </Button>
      </Row>
      <Row style={{ marginTop: '2%' }}>
        <RadioGroup disabled label="Toning" direction="row" name="toning" options={toningOptions} />
      </Row>
      <Row style={{ marginTop: '2%' }}>
        <Upload />
      </Row>
      <Row style={{ marginTop: '2%' }}>
        <FormikText className="sm" name="prep" label="Prep Time" />
        <Button
          style={{ marginTop: '1.16em', marginRight: '2%' }}
          variant={ButtonVariant.action}
          onClick={() => {
            setEffort(effort!! + Number((values as any).prep));
          }}
        >
          Add
        </Button>
        <FormikText disabled className="sm" name="total" label="Total" value={effort?.toString()} />
        <Button
          onClick={() => {
            setContent({ ...content, timeTrackings: values.timeTrackings });
            toggle();
          }}
          style={{ marginTop: '1.16em' }}
          variant={ButtonVariant.action}
        >
          View Log
        </Button>
        <Modal
          hide={toggle}
          isShowing={isShowing}
          headerText="Prep Time Log"
          body={<TimeLogTable totalTime={effort} data={content.timeTrackings} />}
          customButtons={
            <Button variant={ButtonVariant.action} onClick={toggle}>
              Close
            </Button>
          }
        />
      </Row>
    </Col>
  );
};
