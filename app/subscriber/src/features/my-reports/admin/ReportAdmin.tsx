import { Action } from 'components/action';
import { Button } from 'components/button';
import { FormikForm } from 'components/formik';
import { Header } from 'components/header';
import { PageSection } from 'components/section';
import { Tabs } from 'components/tabs';
import { ITab } from 'components/tabs/interfaces';
import React from 'react';
import { FaArrowLeft, FaArrowRight, FaCloud, FaTrash } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApp, useLookup, useReports, useReportTemplates } from 'store/hooks';
import { useProfileStore } from 'store/slices';
import { Col, Modal, Row, Settings, useModal } from 'tno-core';

import { defaultReport } from '../constants';
import { IReportForm } from '../interfaces';
import { toForm } from '../utils';
import { ReportSettings } from './ReportSettings';
import { ReportSubscribers } from './ReportSubscribers';
import { ReportTemplate } from './ReportTemplate';
import * as styled from './styled';
import { ReportFormSchema } from './validation/ReportFormSchema';

export interface IReportAdminProps {
  path?: string;
}

export const ReportAdmin: React.FC<IReportAdminProps> = ({ path: defaultPath = 'template' }) => {
  const [{ userInfo }] = useApp();
  const navigate = useNavigate();
  const { id, path = defaultPath } = useParams();
  const [{ myReports }] = useProfileStore();
  const [{ getReport, addReport, deleteReport, updateReport, findMyReports }] = useReports();
  const [{ getReportTemplate }] = useReportTemplates();
  const { toggle, isShowing } = useModal();
  const [{ isReady, settings }] = useLookup();

  const [defaultReportTemplateId, setDefaultReportTemplateId] = React.useState(0);
  const [report, setReport] = React.useState<IReportForm>(
    defaultReport(userInfo?.id ?? 0, defaultReportTemplateId),
  );

  const tabs: ITab[] = React.useMemo(
    () => [
      {
        key: 'id',
        type: 'other',
        label: report.name ? report.name : '[Report Name]',
        className: 'report-name',
      },
      { key: 'template', to: `/reports/${id}/template`, label: <Action label="Report Template" /> },
      { key: 'settings', to: `/reports/${id}/settings`, label: <Action label="Settings" /> },
      {
        key: 'subscribers',
        to: `/reports/${id}/subscribers`,
        label: <Action label="Subscribers" />,
      },
    ],
    [id, report.name],
  );

  React.useEffect(() => {
    if (isReady) {
      const defaultReportTemplateId = settings.find(
        (s) => s.name === Settings.DefaultReportTemplate,
      )?.value;
      if (defaultReportTemplateId) setDefaultReportTemplateId(+defaultReportTemplateId);
      else toast.error(`Configuration settings '${Settings.DefaultReportTemplate}' is required.`);
    }
  }, [isReady, settings]);

  React.useEffect(() => {
    // TODO: Templates don't change much and don't need to be fetched often.
    if (defaultReportTemplateId && report.templateId !== defaultReportTemplateId) {
      getReportTemplate(defaultReportTemplateId)
        .then((template) => {
          if (template) {
            setReport((report) => ({
              ...report,
              templateId: template.id,
              template: template,
            }));
          } else toast.error('There are no public report templates available.');
        })
        .catch(() => {});
    }
  }, [defaultReportTemplateId, getReportTemplate, report.templateId]);

  React.useEffect(() => {
    if (!myReports.length) {
      findMyReports().catch(() => {});
    }
    // Only do this on init.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const reportId = parseInt(id ?? '0');
    if (reportId)
      getReport(reportId)
        .then((result) => {
          if (result) {
            setReport(toForm(result));
          }
        })
        .catch(() => {});
    // Only make a request when 'id' changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = React.useCallback(
    async (values: IReportForm) => {
      try {
        const originalId = values.id;
        const sameNameReport = myReports.some(
          (r) => r.name.trim().toLocaleLowerCase() === values.name.trim().toLocaleLowerCase(),
        );
        if (sameNameReport && !originalId) {
          toast.error(`A report with the name '${values.name}' already exists.`);
        } else {
          const report = originalId
            ? await updateReport(values)
            : await addReport({ ...values, ownerId: values.ownerId ?? userInfo?.id ?? 0 });

          if (!originalId) {
            navigate(`/reports/${report.id}${path ? `/${path}` : ''}`);
            toast.success(`Successfully created '${report.name}'.`);
          } else {
            setReport(toForm(report));
            toast.success(`Successfully updated '${report.name}'.`);
          }
        }
      } catch {}
    },
    [addReport, myReports, navigate, path, updateReport, userInfo?.id],
  );

  const handleDelete = React.useCallback(
    async (values: IReportForm) => {
      try {
        await deleteReport(values);
        toast.success(`Report '${values.name}' has been deleted.`);
        navigate('/reports');
      } catch {}
    },
    [deleteReport, navigate],
  );

  return (
    <styled.ReportAdmin>
      <Header />
      <FormikForm
        initialValues={report}
        validationSchema={ReportFormSchema}
        validateOnChange={false}
        onSubmit={async (values, { setSubmitting }) => {
          await handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ submitForm, values, isSubmitting }) => (
          <PageSection
            header={
              <Row flex="1" alignItems="center" gap="1rem">
                <Col flex="1" gap="0.5rem">
                  <Action
                    icon={<FaArrowLeft />}
                    label="Back to my reports"
                    onClick={() => navigate('/reports')}
                  />
                  <Row alignItems="center">
                    <label>Configure Report Template</label>
                  </Row>
                </Col>
                <Col gap="0.5rem">
                  {!!report.id && (
                    <Action
                      icon={<FaArrowRight />}
                      label="Edit report"
                      direction="row-reverse"
                      onClick={() => navigate(`/reports/${report.id}/edit`)}
                    />
                  )}
                  <Row gap="1rem" justifyContent="flex-end">
                    {!!report.id && (
                      <Action
                        icon={<FaTrash />}
                        title="Delete"
                        onClick={() => toggle()}
                        disabled={isSubmitting}
                      />
                    )}
                    <Button onClick={() => submitForm()} disabled={isSubmitting}>
                      Save
                      <FaCloud />
                    </Button>
                  </Row>
                </Col>
              </Row>
            }
          >
            <div>
              <Col flex="1">
                <Tabs tabs={tabs} activeTab={path}>
                  {(tab) => {
                    if (tab?.key === 'settings') return <ReportSettings />;
                    else if (tab?.key === 'subscribers') return <ReportSubscribers />;
                    return <ReportTemplate onChange={(values) => setReport(values)} />;
                  }}
                </Tabs>
              </Col>
            </div>
            <span></span>
            <Modal
              headerText="Confirm Delete"
              body="Are you sure you wish to delete this report?"
              isShowing={isShowing}
              hide={toggle}
              type="delete"
              confirmText="Yes, Remove It"
              onConfirm={async () => {
                await handleDelete(values);
                toggle();
              }}
            />
          </PageSection>
        )}
      </FormikForm>
    </styled.ReportAdmin>
  );
};
