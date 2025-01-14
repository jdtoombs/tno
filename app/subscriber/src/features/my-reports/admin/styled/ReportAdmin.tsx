import styled from 'styled-components';

export const ReportAdmin = styled.div`
  form {
    background: unset;
  }

  .tab.report-name {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 1.5rem;
    background: ${(props) => props.theme.css.highlightPrimary};

    label {
      text-transform: uppercase;
    }
  }

  .section-bar {
    align-items: center;
    margin: 0.5rem 1rem;
    padding: 0.5rem;
    background: ${(props) => props.theme.css.bkTertiary};
    border: solid 1px ${(props) => props.theme.css.iconPrimaryColor};
    border-radius: 0.5rem;

    svg {
      min-height: 25px;
      min-width: 25px;
      color: ${(props) => props.theme.css.iconPrimaryColor};
    }

    button {
      max-height: unset;
      padding: 1rem;
      background: ${(props) => props.theme.css.highlightSecondary};
      border: solid 1px ${(props) => props.theme.css.iconPrimaryColor};
      color: ${(props) => props.theme.css.iconPrimaryColor};

      > div {
        align-items: center;
      }

      text-transform: uppercase;
    }
  }

  .report-template {
    padding: 1rem;
    gap: 1rem;

    > div:not(:first-child) {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
`;
