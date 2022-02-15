import {
  Area,
  Button,
  Col,
  FormikCheckbox,
  FormikDropdown,
  FormikText,
  IOptionItem,
  OptionItem,
  Row,
  Tab,
  TabContainer,
} from 'components';
import { Formik } from 'formik';
import { IContentModel, useApiEditor } from 'hooks';
import { noop } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLookup } from 'store';

import { PropertiesContentForm } from '.';
import { TranscriptContentForm } from './TranscriptContentForm';

/**
 * Content Form edit and create form for default view. Path will be appeneded with content id.
 * @returns Edit/Create Form for Content
 */
export const ContentForm: React.FC = () => {
  const [active, setActive] = useState('properties');
  const navigate = useNavigate();
  const {
    storeMediaTypes,
    state: { mediaTypes },
  } = useLookup();
  const [mediaTypeOptions, setMediatTypeOptions] = useState<IOptionItem[]>([]);
  const api = useApiEditor();
  // set id based on url if exists ? id : 0
  const id = 0;

  // include id when it is an update, no idea necessary when new content
  const postContent = (content: IContentModel, id: number) => {
    !!id ? api.addContent(content) : api.addContent(content, id);
  };

  // Populate lookup values on initial render
  useEffect(() => {
    mediaTypes.length === 0 && api.getMediaTypes().then((data) => storeMediaTypes(data));
  }, [api, mediaTypes, storeMediaTypes]);

  useEffect(() => {
    setMediatTypeOptions(
      [new OptionItem('All Media', 0)].concat(mediaTypes.map((m) => new OptionItem(m.name, m.id))),
    );
  }, [mediaTypes]);

  return (
    <Area>
      <Row>
        <Button onClick={() => navigate('/contents')}>Back to List View</Button>
      </Row>
      <Formik onSubmit={() => console.log('here')} initialValues={{}}>
        <Col>
          <Row style={{ marginTop: '2%' }}>
            <Col>
              <Row>
                <FormikText className="lrg" name="headline" label="Headline" />
              </Row>
              <Row>
                <Col>
                  <FormikDropdown className="md" name="source" label="Source" />
                </Col>
                <Col style={{ marginLeft: '40px' }}>
                  <FormikText className="md" name="source" label="Other Source" />
                </Col>
              </Row>
              <Row>
                <FormikDropdown
                  className="md"
                  name="mediaType"
                  label="Media Type"
                  options={mediaTypeOptions}
                />
              </Row>
            </Col>
            <Col style={{ marginLeft: '3%' }}>
              <Row>
                <Col>
                  <FormikCheckbox name="publish" labelRight label="Publish" />
                  <FormikCheckbox name="alert" labelRight label="Alert" />
                  <FormikCheckbox name="frontPage" labelRight label="Front Paage" />
                  <FormikCheckbox name="commentary" labelRight label="Commentary" />
                </Col>
                <Col>
                  <FormikCheckbox name="alert" labelRight label="Top Story " />
                  <FormikCheckbox name="frontPage" labelRight label="On Ticker" />
                  <FormikCheckbox name="commentary" labelRight label="Commentary" />
                </Col>
              </Row>
              <Row>
                <FormikText name="timeout" label="Commentary Timeout" disabled />
              </Row>
            </Col>
          </Row>
          <Row>
            <TabContainer
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
              {active === 'properties' ? <PropertiesContentForm /> : <TranscriptContentForm />}
            </TabContainer>
          </Row>
          <Row>
            <Button onClick={noop}>Create Snippet </Button>
            <Button>Remove Snippet </Button>
          </Row>
        </Col>
      </Formik>
    </Area>
  );
};
