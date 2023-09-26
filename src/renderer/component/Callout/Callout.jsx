// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";

import Modal from "react-bootstrap/Modal";

const Style = Styled.div`	
&.mt-xs {
	margin-top: 8px;
}
&.mt-sm {
	margin-top: 16px;
}
&.mt-md {
	margin-top: 24px;
}
&.mt-lg {
	margin-top: 32px;
}
&.mt-xl {
	margin-top: 42px;
}
.callOutIcon {	
	position: absolute;
	top: 16px;
	left: -18px;
	.iconInfo {
		fill: ${({ theme }) => theme.styles.callout.iconInfo}; 
	}
	.infoShadow {
		fill: ${({ theme }) => theme.styles.callout.iconInfoShadowColor}; 
		mix-blend-mode: multiply;
	}
	.infoCircle {
		fill: ${({ theme }) => theme.styles.callout.iconInfoBackground}; 
		stroke: ${({ theme }) => theme.styles.callout.iconInfoBorder}; 
	}
}
.callOut {
	position: relative;
	border-radius: 6px;
	padding: 24px 32px;
	color: ${({ theme }) => theme.styles.callout.calloutColor}; 
	background: ${({ theme }) => theme.styles.callout.calloutBackground}; 
	border: 1px solid ${({ theme }) => theme.styles.callout.calloutBorderColor}; 
	font-size: 14px; 
	font-weight: 395;
	line-height: 1.35em;
	&.sm {
		font-size: 13px; 
		padding: 16px 28px;
		.callOutIcon {	
			top: 7px;
		}
	}
	&.md {
		font-size: 15px; 
	}	
	&.lg {
		font-size: 16px; 
	}		
	&.xl {
		font-size: 18px; 
	}
	&.hasVideo {
		padding-right: 52px;
	}	
	p:last-of-type {
		margin-bottom: 0;
	}
}
.playCounter {
	position: absolute;
    top: 16px;
    right: -18px;
	.playCounterInner {
		display: flex;
		position: relative;
		align-items: center;
		grid-gap: 4px;
		padding: 2px;
		border-radius: 3px;
		background: rgba(107, 119, 148, 0.5);
		backdrop-filter: blur(3px);
		overflow: hidden;
	}
	.playCounterInner:before {
		content: "";
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background: ${({ theme }) => theme.colors.gradient};
		background-size: 300%;
		opacity: 0;
		transition: 250ms opacity ease-in-out;
	}
	.playCounterInner:hover {
		cursor: pointer;
		&:before {
			opacity: 1;
		}
	}
	.playCounterIcon {
		align-self: center;
		line-height: 1;
		padding: 0 3px 2px 6px;
		position: relative;
	}
	.playCounterTimer {
		background: rgba(107, 119, 148, 0.3);
		color: ${({ theme }) => theme.colors.gray25};
		backdrop-filter: blur(3px);
		font-size: 0.65rem;
		font-weight: 600;
		border-radius: 3px;
		line-height: 1.5em;
		padding: 2px 4px;
		font-weight: 600;
	}
}
`;

/**
 * This Callout function returns an element to help the user with a piece of information with help text, how to use a specific feature, and media to expand the explanation.
 * The object will accept the following parameters
 *
 * @param {string} content - The content of the card - Accepts HTML
 * @param {string} media - Media not implemented
 * @param {string} size - The size of the texts, supports [ sm | md | lg | xl ]
 * @param {string} className - The addtional class name that helps style the callout in some scenarios.
 * @param {number} maxWidth - The max with of the element.
 * @param {string} videoDuration - The video length
 * @param {boolean} hasVideo - Check if video exists
 */

function Callout(props) {
  const { content, media, size, className, maxWidth, hasVideo, videoDuration, videoTitle } = props;
  let maxStyle = { maxWidth: "auto" };
  if (maxWidth) {
    maxStyle = { maxWidth: `${maxWidth}px` };
  }
  const [modalCallOut, setModalCallOut] = useState(false);

  return (
    <Style className={className}>
      <div className={`callOut ${size && size} ${hasVideo ? "hasVideo" : ""}`} style={maxStyle}>
        <svg className="callOutIcon" width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="19" cy="20" r="17" fill="currentColor" className="infoShadow" />
          <circle cx="17" cy="17" r="16.5" fill="currentColor" stroke="currentColor" className="infoCircle" />
          <path
            d="M17.186 10.688C17.21 10.172 17.396 9.776 17.744 9.5C18.104 9.224 18.53 9.086 19.022 9.086C19.466 9.086 19.802 9.194 20.03 9.41C20.27 9.614 20.378 9.902 20.354 10.274C20.33 10.742 20.138 11.126 19.778 11.426C19.418 11.714 18.986 11.858 18.482 11.858C18.062 11.858 17.732 11.756 17.492 11.552C17.264 11.336 17.162 11.048 17.186 10.688ZM16.502 15.224C16.706 14.624 16.64 14.324 16.304 14.324C16.088 14.324 15.89 14.432 15.71 14.648C15.53 14.864 15.344 15.23 15.152 15.746L14.792 16.664H14.45L14.954 15.296C15.122 14.816 15.332 14.444 15.584 14.18C15.848 13.916 16.136 13.73 16.448 13.622C16.772 13.502 17.108 13.442 17.456 13.442C17.876 13.442 18.206 13.52 18.446 13.676C18.686 13.832 18.848 14.036 18.932 14.288C19.016 14.528 19.046 14.798 19.022 15.098C18.998 15.386 18.938 15.674 18.842 15.962L16.952 21.47C16.844 21.794 16.814 22.028 16.862 22.172C16.922 22.304 17.036 22.37 17.204 22.37C17.36 22.37 17.528 22.28 17.708 22.1C17.9 21.92 18.11 21.536 18.338 20.948L18.662 20.084H19.004L18.536 21.398C18.368 21.89 18.152 22.268 17.888 22.532C17.624 22.796 17.336 22.982 17.024 23.09C16.724 23.198 16.418 23.252 16.106 23.252C15.59 23.252 15.194 23.138 14.918 22.91C14.654 22.682 14.51 22.352 14.486 21.92C14.462 21.488 14.546 20.978 14.738 20.39L16.502 15.224Z"
            fill="currentColor"
            className="iconInfo"
          />
        </svg>
        <div className="calloOutInner">
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        {hasVideo && media ? (
          <div className="playCounter" onClick={() => setModalCallOut(true)} aria-hidden="true">
            <div className="playCounterInner">
              <div className="playCounterIcon">
                <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.47434 5.4674C8.95355 5.78359 8.95355 6.48668 8.47434 6.80288L1.36206 11.4958C0.83017 11.8467 0.121463 11.4653 0.121463 10.828L0.121464 1.44224C0.121464 0.805008 0.830172 0.423553 1.36206 0.774506L8.47434 5.4674Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="playCounterTimer">{videoDuration}</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {hasVideo && media ? (
        <Modal
          size="lg"
          show={modalCallOut}
          onHide={() => setModalCallOut(false)}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{videoTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modalContent">
              <div className="embed-responsive embed-responsive-16by9">
                <iframe
                  className="embed-responsive-item"
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${media}`}
                  title={videoTitle}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        ""
      )}
    </Style>
  );
}

Callout.propTypes = {
  content: PropTypes.string,
  media: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  maxWidth: PropTypes.number,
  hasVideo: PropTypes.bool,
  videoDuration: PropTypes.string,
  videoTitle: PropTypes.string,
};

export default Callout;
