import { Button, ButtonVariant } from 'components/button';
import { Col } from 'components/col';
import { Area, IOptionItem, OptionItem } from 'components/form';
import { FormikCheckbox, FormikDropdown, FormikText } from 'components/formik';
import { Modal } from 'components/modal';
import { Row } from 'components/row';
import { Tab, Tabs } from 'components/tabs';
import { Formik } from 'formik';
import { ContentStatus } from 'hooks';
import useModal from 'hooks/modal/useModal';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContent, useLookup } from 'store/hooks';
import { useApp } from 'store/hooks/app/useApp';
import { getSortableOptions } from 'utils';

import { PropertiesContentForm } from '.';
import { defaultFormValues } from './constants';
import { IContentForm } from './interfaces';
import { TranscriptContentForm } from './TranscriptContentForm';
import { toForm, toModel } from './utils';

/**
 * Content Form edit and create form for default view. Path will be appended with content id.
 * @returns Edit/Create Form for Content
 */
export const ContentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [{ mediaTypes }] = useLookup();
  const [, { getContent, addContent, updateContent, deleteContent }] = useContent();
  const { isShowing, toggle } = useModal();

  const [active, setActive] = React.useState('properties');
  const [mediaTypeOptions, setMediaTypeOptions] = React.useState<IOptionItem[]>([]);
  const [content, setContent] = React.useState<IContentForm>({
    ...defaultFormValues,
    id: parseInt(id ?? '0'),
  });
  const [toggleCommentary, setToggleCommentary] = React.useState(true);

  const fakeActions = [
    { id: 2, value: 'true' },
    { id: 6, value: 'true' },
  ];

  // include id when it is an update, no idea necessary when new content
  const submitContent = async (values: IContentForm) => {
    values.contentTypeId = 1;
    values.ownerId = 1;
    const model = toModel(values);
    const result = !content.id ? await addContent(model) : await updateContent(model);
    toForm(result);
  };

  React.useEffect(() => {
    if (!!content.id) {
      getContent(content.id).then((data) => setContent(toForm(data)));
    }
  }, [content.id, getContent]);

  React.useEffect(() => {
    setMediaTypeOptions(getSortableOptions(mediaTypes, [new OptionItem<number>('All Media', 0)]));
  }, [mediaTypes]);

  return (
    <Area>
      <Row>
        <Button variant={ButtonVariant.action} onClick={() => navigate('/contents')}>
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
        onSubmit={async (values) => {
          await submitContent(values);
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
                    <FormikText disabled className="md" name="otherSource" label="Other Source" />
                  </Col>
                </Row>
                <Row>
                  <FormikDropdown
                    className="md"
                    name="mediaTypeId"
                    value={mediaTypeOptions.find((mt) => mt.value === content.mediaTypeId)}
                    onChange={(e: any) => setContent({ ...content, mediaTypeId: e.value })}
                    label="Media Type"
                    options={mediaTypeOptions}
                  />
                </Row>
              </Col>
              <Col style={{ marginLeft: '3%', marginRight: '10%' }}>
                <Row style={{ marginTop: '4.5%' }}>
                  <Col style={{ width: '215px' }}>
                    <FormikCheckbox
                      className="chk"
                      name="publish"
                      labelRight
                      label="Publish"
                      checked={
                        content.status === ContentStatus.Publish ||
                        content.status === ContentStatus.Published
                      }
                      onChange={(e: any) => {
                        setContent({
                          ...content,
                          status: e.target.checked ? ContentStatus.Publish : ContentStatus.Draft,
                        });
                      }}
                    />
                    <FormikCheckbox
                      className="chk"
                      name="alert"
                      labelRight
                      label="Alert"
                      checked={!!fakeActions.find((x) => x.id === 2)}
                    />
                    <FormikCheckbox
                      className="chk"
                      name="frontPage"
                      labelRight
                      label="Front Page"
                      checked={!!fakeActions.find((x) => x.id === 3)}
                    />
                    <FormikCheckbox
                      name="commentary"
                      className="chk"
                      onClick={() => setToggleCommentary(!toggleCommentary)}
                      labelRight
                      label="Commentary"
                      checked={!!fakeActions.find((x) => x.id === 7)}
                    />
                  </Col>
                  <Col style={{ width: '215px' }}>
                    <FormikCheckbox
                      className="chk"
                      name="topStory"
                      labelRight
                      label="Top Story"
                      checked={!!fakeActions.find((x) => x.id === 4)}
                    />
                    <FormikCheckbox
                      className="chk"
                      name="onTicker"
                      labelRight
                      label="On Ticker"
                      checked={!!fakeActions.find((x) => x.id === 5)}
                    />
                    <FormikCheckbox
                      className="chk"
                      name="nonQualified"
                      labelRight
                      label="Non Qualified Subject"
                      checked={!!fakeActions.find((x) => x.id === 6)}
                    />
                  </Col>
                </Row>
                <Row>
                  <FormikText
                    name="timeout"
                    label="Commentary Timeout"
                    disabled={content.id ? toggleCommentary : true}
                    className="md"
                  />
                </Row>
              </Col>
            </Row>
            <Row>
              <Tabs
                tabs={
                  <>
                    <Tab
                      label="Properties"
                      onClick={() => setActive('properties')}
                      active={active === 'properties'}
                    />
                    <Tab
                      label="Transcript"
                      onClick={() => setActive('transcript')}
                      active={active === 'transcript'}
                    />
                  </>
                }
              >
                {active === 'properties' ? (
                  <PropertiesContentForm content={content} setContent={setContent} />
                ) : (
                  <TranscriptContentForm content={content} setContent={setContent} />
                )}
              </Tabs>
            </Row>
            <Row style={{ marginTop: '2%' }}>
              <Button
                style={{ marginRight: '4%' }}
                type="submit"
                onClick={async () => {
                  try {
                    submitContent(props.values);
                  } finally {
                    navigate('/contents');
                  }
                }}
              >
                {!content.id ? 'Create Snippet' : 'Update Snippet'}
              </Button>
              <Button onClick={toggle} variant={ButtonVariant.danger}>
                Remove Snippet
              </Button>
            </Row>
            <Modal
              headerText="Confirm Removal"
              body="Are you sure you wish to remove this snippet?"
              isShowing={isShowing}
              hide={toggle}
              type="delete"
              confirmText="Yes, Remove It"
              onConfirm={() => {
                try {
                  deleteContent(toModel(props.values));
                } finally {
                  toggle();
                  navigate('/contents');
                }
              }}
            />
          </Col>
        )}
      </Formik>
    </Area>
  );
};
