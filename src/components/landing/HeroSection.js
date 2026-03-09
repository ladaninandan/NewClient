import React from "react";
import { useConfig } from "../../context/ConfigContext";

export function HeroSection() {
  const { config } = useConfig();

  const ribbonText =
    config.bannerFullText ||
    `${config.bannerText || ""} ON ${config.eventDate || ""} (${config.eventTime || ""})`.trim();

  return (
    <section className="py-4">
      <div className="container">

        <div className="card border-0 shadow-sm rounded-4 bg-secondary bg-gradient  text-center bg-opacity-25 position-relative p-4 pt-5 ">

          {ribbonText && (
            <div
              className="position-absolute start-50 translate-middle-x text-white fw-bold px-3 py-2 rounded-3 shadow  "
              style={{
                top: "-18px",
                background: "linear-gradient(180deg,#ff9a57,#ff7a45)",
                fontSize: "14px"
              }}
            >
              {ribbonText}
            </div>
          )}

          <div className="card-body">

            <h1 className="fw-bold text-dark mb-4 fs-3 pt-4">
              {config.title}
            </h1>

            <hr className=""/>
            {config.subHeadline && (
              <p className="text-muted mb-3">
                {config.subHeadline}
              </p>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}