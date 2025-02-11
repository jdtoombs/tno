import styled from 'styled-components';
import { Col } from 'tno-core';

export const Landing = styled(Col)`
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'BCSans', 'Noto Sans', Arial, 'sans serif';
  display: flex;
  .search-links {
    color: #3847aa;
    text-decoration: underline;
    &:hover {
      cursor: pointer;
    }
  }

  .title {
    font-family: 'Source Sans Pro', sans-serif;
  }

  /* header for viewing a piece of content on the landing page */
  .view {
    svg {
      cursor: pointer;
      color: #a5a4bf;
    }
  }

  /* The panel containing Commentary and front pages */
  .right-panel {
    max-height: calc(100vh - 6.5em);
    @media (min-width: 1702px) {
      max-width: 44%;
    }
    margin-left: auto;
    flex-grow: 1;
    margin-right: auto;

    display: flex;

    input {
      min-height: 3em;
      border-radius: none;
      max-width: 60%;
    }
  }

  /* container containing both panels */
  .contents-container {
    overflow-y: auto;
    margin-left: 0.5em;
    max-height: calc(100vh - 9em);
  }

  .title {
    background-color: white;
    padding: 0.5em;
    font-size: 1.35em;
    color: #971d29;
    font-weight: bold;
    border-bottom: 1px solid #56537a;
  }
  /* The panel containing the media list */
  .main-panel {
    /* switch between max width and min width depending on screen size in order to maximize screen real estate */
    @media (max-width: 1702px) {
      min-width: 100%;
    }
    @media (min-width: 1000px) {
      max-width: 55%;
    }
    flex-grow: 1;
    margin-bottom: 0.5em;

    .content {
      background-color: white;
      @media (max-width: 500px) {
        padding: 0.25em;
      }
      @media (min-width: 500px) {
        padding: 1em;
      }
      min-height: 45em;
    }

    /* TODO: move these to the button component as styling configuration */
  }
`;
