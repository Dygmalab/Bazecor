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

import React from "react";
import Styled from "styled-components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@Renderer/components/ui/accordion";
import Spinner from "react-bootstrap/Spinner";
import i18n from "../../i18n";

import Title from "../../component/Title";

const Style = Styled.div`
.card-header:hover {
  cursor: pointer;
}
h5 {
  color: ${({ theme }) => theme.colors.gray400};
  font-size: 14px;
  margin-bottom: 32px;
  text-transform: none;
  letter-spacing: -0.03em;
}
`;

function WhatsNew() {
  const [contentRelease, setContentRelease] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [datePublished, setDatePublished] = React.useState(null);
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  const fetchContentOnClick = () => {
    async function fetchContent(url: string) {
      try {
        const response = await fetch(url);
        const json = await response.json();
        const d = new Date(json.published_at);
        setDatePublished(d.toLocaleDateString("en-US", dateOptions as Intl.DateTimeFormatOptions));
        setContentRelease(json);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchContent(`https://api.github.com/repos/Dygmalab/Bazecor/releases/latest`);
  };

  return (
    <Style>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger onClick={fetchContentOnClick}>
            <div className="accordionHeader">
              <div className="accordionTitle">{i18n.firmwareUpdate.texts.whatsNewTitle}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              {loading && !error ? (
                <div className="loading marginCenter">
                  <Spinner className="spinner-border" role="status" animation="border" />
                </div>
              ) : (
                ""
              )}
              {error ? <div className="error">Error</div> : ""}
              {!loading && (
                <div className="cardContent">
                  <Title text={`${i18n.firmwareUpdate.texts.whatsNewTitleVersion} ${contentRelease.name}`} headingLevel={3} />
                  <Title text={datePublished} headingLevel={5} />
                  <div className="versionContent" dangerouslySetInnerHTML={{ __html: contentRelease.body }} />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Style>
  );
}

export default WhatsNew;
