import { Button } from 'components/button';
import { Col } from 'components/col';
import { Area, RadioGroup } from 'components/form';
import { FormikCheckbox, FormikDropdown, FormikText, FormikTextArea } from 'components/formik';
import { Row } from 'components/row';
import { Formik } from 'formik';
import { ContentStatus, WorkflowStatus } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent, useLookup } from 'store/hooks';
import { ButtonVariant } from 'tno-core';

import { PropertiesContentForm } from '.';
import { toningOptions } from './constants';
import { IContentForm } from './interfaces';
import { TranscriptContentForm } from './TranscriptContentForm';

/**
 * Content Form edit and create form for default view. Path will be appeneded with content id.
 * @returns Edit/Create Form for Content
 */
export const PrintContentForm: React.FC = () => {
  const navigate = useNavigate();
  const path = window.location.pathname.toString();
  const getContentId = () => {
    return Number(path.substring(path.lastIndexOf('/') + 1));
  };

  const [mode] = useState<'edit' | 'create'>(getContentId() === 0 ? 'create' : 'edit');

  const defaultValues: IContentForm = {
    id: 0,
    status: ContentStatus.Draft,
    mediaTypeId: 0,
    headline: '',
    summary: '',
    contentTypeId: 0,
    source: '',
    licenseId: 0,
    page: '',
    section: '',
    transcription: '',
    ownerId: 0,
    publishedOn: '',
    seriesId: undefined,
    uid: '',
    sourceUrl: '',
    workflowStatus: WorkflowStatus.InProgress,
    edition: '',
    storyType: '',
    byline: '',
    timeTrackings: [],
  };
  const id = getContentId();
  const [content, setContent] = useState<any>(defaultValues);
  const [toggleCommentary, setToggleCommentary] = useState(true);

  // // include id when it is an update, no idea necessary when new content
  // const submitContent = async (data: IContentForm, contentId?: number) => {
  //   mode === 'create' ? await api.addContent(data) : await api.updateContent(data, id);
  //   navigate('/contents');
  // };

  // useEffect(() => {
  //   api.findContent(id).then((data: any) => setContent(data));
  // }, [api, id]);

  return (
    <Area>
      <Row>
        <Button variant={ButtonVariant.secondary} onClick={() => navigate('/contents')}>
          <Row>
            <img
              style={{ marginRight: '0.5em' }}
              alt="back"
              src={process.env.PUBLIC_URL + '/assets/back_arrow.svg'}
            />
            <p>Back to List View</p>
          </Row>
        </Button>
      </Row>
      <Formik
        enableReinitialize
        onSubmit={(values) => {
          // submitContent(formContentToApiContent(values));
        }}
        initialValues={content}
      >
        {(props) => (
          <Col>
            <Row style={{ marginTop: '2%' }}>
              <Col>
                <Row>
                  <FormikText
                    className="lrg"
                    name="headline"
                    label="Headline"
                    value={props.values.headline}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContent({ ...content, headline: e.target.value })
                    }
                  />
                </Row>
                <Row>
                  <Col>
                    <FormikText
                      className="md"
                      name="source"
                      label="Source"
                      value={props.values.source}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContent({ ...content, source: e.target.value })
                      }
                    />
                  </Col>
                  <Col style={{ marginLeft: '5%' }}>
                    <FormikText className="md" name="edition" label="Edition" />
                  </Col>
                </Row>
                <Row>
                  <FormikText
                    className="md-sm space-right"
                    name="section"
                    value={props.values.section}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContent({ ...content, section: e.target.value })
                    }
                    label="Section"
                  />
                  <FormikText
                    className="md-sm space-right"
                    name="storyType"
                    value={props.values.storyTpe}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContent({ ...content, storyType: e.target.value })
                    }
                    label="Story Type"
                  />
                  <FormikText
                    className="md-sm"
                    name="page"
                    value={props.values.page}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContent({ ...content, page: e.target.value })
                    }
                    label="Page"
                  />
                </Row>
                <Row>
                  <FormikTextArea name="byLine" label="By Line" style={{ width: '675px' }} />
                </Row>
              </Col>
              <Col style={{ marginLeft: '3%', marginRight: '10%' }}>
                <Row style={{ marginTop: '4.5%' }}>
                  <Col style={{ width: '215px' }}>
                    <FormikCheckbox
                      disabled
                      className="chk"
                      name="publish"
                      labelRight
                      label="Publish"
                    />
                    <FormikCheckbox
                      disabled
                      className="chk"
                      name="alert"
                      labelRight
                      label="Alert"
                    />
                    <FormikCheckbox
                      className="chk"
                      name="frontPage"
                      labelRight
                      disabled
                      label="Front Page"
                    />
                    <FormikCheckbox
                      name="commentary"
                      className="chk"
                      disabled={mode === 'create'}
                      onClick={() => setToggleCommentary(!toggleCommentary)}
                      labelRight
                      label="Commentary"
                    />
                  </Col>
                  <Col style={{ width: '215px' }}>
                    <FormikCheckbox
                      disabled
                      className="chk"
                      name="onTicker"
                      labelRight
                      label="On Ticker"
                    />
                    <FormikCheckbox
                      disabled
                      className="chk"
                      name="justIn"
                      labelRight
                      label="Just In"
                    />
                    <FormikCheckbox
                      className="chk"
                      name="topStory"
                      disabled
                      labelRight
                      label="Top Story"
                    />
                  </Col>
                </Row>
                <Row>
                  <FormikText
                    name="timeout"
                    label="Commentary Timeout"
                    disabled={mode === 'edit' ? toggleCommentary : true}
                    className="md"
                  />
                </Row>
              </Col>
            </Row>
            <Row>
              <FormikTextArea
                name="content"
                label="Content"
                value={props.values.content}
                onChange={(e: any) => setContent({ ...content, content: e.target.value })}
                style={{ width: '1035px', height: '800px' }}
              />
            </Row>
            <RadioGroup
              disabled
              label="Toning"
              direction="row"
              name="toning"
              options={toningOptions}
            />
            <Row>
              <FormikDropdown
                outerClassName="space-right"
                className="md"
                name="eod"
                label="EoD Category"
              />
              <FormikDropdown className="md" name="score" label="Score" />
            </Row>
            <Row style={{ marginTop: '2%', justifyContent: 'center' }}>
              <Button
                style={{ marginRight: '1%' }}
                type="submit"
                variant={ButtonVariant.secondary}
                onClick={() => console.log('')}
              >
                Previous
              </Button>
              <Button variant={ButtonVariant.secondary}>Next</Button>
            </Row>
          </Col>
        )}
      </Formik>
    </Area>
  );
};
