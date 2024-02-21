// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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
import { MemoryRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "@appigram/react-rangeslider/lib/index.css";
import { i18n } from "@Renderer/i18n";
import App from "./App";
import Error from "./Error";
import "./theme/styles.css";
import { DeviceProvider } from "./DeviceContext";
import ErrorBoundary from "./ErrorBoundary";

const container = document.getElementById("root");
const root = createRoot(container);
try {
  root.render(
    <ErrorBoundary>
      <MemoryRouter>
        <DeviceProvider>
          <I18nextProvider i18n={i18n}>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={false}
              hideProgressBar={false}
              newestOnTop={false}
              draggable={false}
              closeOnClick
              pauseOnHover
              pauseOnFocusLoss
            />
          </I18nextProvider>
        </DeviceProvider>
      </MemoryRouter>
    </ErrorBoundary>,
  );
} catch (e) {
  root.render(<Error error={e} />);
}
