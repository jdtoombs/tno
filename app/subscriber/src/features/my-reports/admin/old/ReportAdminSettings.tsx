import { Box } from 'components/box';
import { useFormikContext } from 'formik';
import React from 'react';
import { FaFileInvoice, FaSyncAlt } from 'react-icons/fa';
import { useReports } from 'store/hooks/subscriber/useReports';
import { useProfileStore } from 'store/slices';
import {
  Button,
  Col,
  FormikCheckbox,
  FormikSelect,
  FormikText,
  FormikTextArea,
  getSortableOptions,
  IOptionItem,
  OptionItem,
  Row,
} from 'tno-core';

import { IReportForm } from '../../interfaces';
import { hideEmptySections } from '../../utils';
import { ReportSchedule } from './components';

export const ReportAdminSettings: React.FC = () => {
  const { values, setFieldValue, setValues } = useFormikContext<IReportForm>();
  const [{ myReports }] = useProfileStore();
  const [{ findMyReports }] = useReports();

  const [reportOptions, setReportOptions] = React.useState<IOptionItem[]>([]);

  const fetchMyReports = React.useCallback(async () => {
    try {
      const reports = await findMyReports();
      setReportOptions(getSortableOptions(reports));
    } catch {}
  }, [findMyReports]);

  React.useEffect(() => {
    if (!myReports.length) {
      fetchMyReports().catch(() => {});
    }
    // Initialize first time this component loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Col gap="1rem">
      <Box title="Identify your report" icon={<FaFileInvoice />}>
        <FormikText
          name="name"
          label="Report Name:"
          required
          placeholder="Enter unique report name"
        />
        <FormikTextArea name="description" label="Description:" />
      </Box>
      <Box title="Content Settings" icon={<FaFileInvoice />}>
        <Row gap="1rem">
          <Col flex="1">
            <Col className="frm-in">
              <label>Table of Contents Format</label>
              <FormikCheckbox name="settings.headline.showSource" label="Show source" />
              <FormikCheckbox name="settings.headline.showShortName" label="Show common call" />
              <FormikCheckbox name="settings.headline.showPublishedOn" label="Show published on" />
              <FormikCheckbox name="settings.headline.showByline" label="Show byline" />
              <FormikCheckbox name="settings.headline.showSentiment" label="Show sentiment" />
            </Col>
            <Col className="frm-in">
              <label>Content Format</label>
              <FormikCheckbox
                name="settings.content.showLinkToStory"
                label="Include Link to Story"
              />
              <FormikCheckbox
                name="settings.sections.usePageBreaks"
                label="Use page breaks when formatting reports"
              />
              <FormikCheckbox
                name="settings.content.highlightKeywords"
                label="Highlight search terms in body text"
              />
            </Col>
          </Col>

          <Col flex="1">
            <Col className="frm-in">
              <label>Section options</label>
              <FormikCheckbox
                name="hideEmptySections"
                label="Hide sections with no stories"
                onChange={(e) => {
                  setValues(hideEmptySections(values, e.target.checked));
                }}
              />
            </Col>

            <Col className="frm-in">
              <label>Content options:</label>
              <FormikCheckbox
                name="settings.content.onlyNewContent"
                label="Include only new content posted after previous report"
              />
              <FormikCheckbox
                name="settings.content.omitBCUpdates"
                label="Omit all BC Updates and BC Calendars from report"
                disabled
              />
              <FormikCheckbox
                name="settings.content.excludeHistorical"
                label="Exclude stories that have been sent out in previous report"
              />
            </Col>
            <FormikSelect
              label="Exclude related report content"
              name="settings.content.excludeReports"
              tooltip="Excludes content already reported on in the selected reports"
              options={reportOptions}
              isMulti
              value={reportOptions.filter((ro) =>
                values.settings.content.excludeReports?.some((reportId) => reportId === ro.value),
              )}
              onChange={(newValue) => {
                if (Array.isArray(newValue))
                  setFieldValue(
                    'settings.content.excludeReports',
                    newValue.map((v: OptionItem) => v.value),
                  );
              }}
            >
              <Button height="38px" onClick={() => fetchMyReports()} tooltip="Fetch my reports">
                <FaSyncAlt />
              </Button>
            </FormikSelect>
            <FormikCheckbox
              name="settings.content.clearFolders"
              label="Clear all folders after report runs"
            />
          </Col>
        </Row>
      </Box>
      <Box title="Sending Options" icon={<FaFileInvoice />}>
        <Row alignItems="center">
          <Col flex="1">
            <FormikText name="settings.subject.text" label="Email subject line:" required />
          </Col>
          <FormikCheckbox name="settings.subject.showTodaysDate" label="Append today's date" />
        </Row>
        <Col className="frm-in">
          <label>Recipients:</label>
        </Col>
        <Col className="frm-in schedules">
          <label>Schedules:</label>
          <Row gap="1rem">
            <Col flex="1">
              <ReportSchedule index={0} label="Schedule 1" />
            </Col>
            <Col flex="1">
              <ReportSchedule index={1} label="Schedule 2" />
            </Col>
          </Row>
        </Col>
      </Box>
    </Col>
  );
};
