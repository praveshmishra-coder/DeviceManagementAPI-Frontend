import React, { useState } from "react";

const InteractiveIndustry = () => {
  const [expanded, setExpanded] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);

  const handleCheck = () => {
    const answer = quizAnswer.trim().toLowerCase();

    if (!answer) {
      setQuizResult({ ok: false, text: "Please enter an answer." });
    } else if (answer === "sensors" || answer === "smart sensors") {
      setQuizResult({
        ok: true,
        text: "✅ Correct — sensors are a core part of Industry 4.0.",
      });
    } else {
      setQuizResult({
        ok: false,
        text: "❌ Not quite — think about devices that collect data (hint: sensors).",
      });
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">🏭 What is Industry 4.0?</h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Industry 4.0 is the digital transformation of manufacturing,
            combining connectivity, automation, and data-driven systems to make
            factories smarter and more efficient.
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          {expanded ? "Show less" : "Learn more"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Smart Sensors & IoT</strong> — collect data from machines
              and environments.
            </li>
            <li>
              <strong>Automation & Robotics</strong> — perform precise and
              repetitive tasks.
            </li>
            <li>
              <strong>AI & Machine Learning</strong> — analyze data for
              intelligent decisions.
            </li>
            <li>
              <strong>Big Data & Cloud</strong> — store and process large
              datasets.
            </li>
            <li>
              <strong>Cyber-Physical Systems</strong> — integrate hardware with
              software and networking.
            </li>
          </ul>

          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <div className="font-medium text-gray-800">
              Quick Check — Try this:
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Name one core device type that collects data in Industry 4.0:
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={quizAnswer}
                onChange={(e) => {
                  setQuizAnswer(e.target.value);
                  setQuizResult(null);
                }}
                placeholder="e.g. sensors"
                className="rounded-lg border px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={handleCheck}
                className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
              >
                Check
              </button>
              <button
                onClick={() => {
                  setQuizAnswer("");
                  setQuizResult(null);
                }}
                className="px-3 py-2 rounded-md border text-sm"
              >
                Reset
              </button>
            </div>

            {quizResult && (
              <div
                className={`mt-3 text-sm ${
                  quizResult.ok ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {quizResult.text}
              </div>
            )}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Want to learn more?{" "}
            <a
              className="text-blue-600 underline"
              href="https://en.wikipedia.org/wiki/Industry_4.0"
              target="_blank"
              rel="noreferrer"
            >
              Read Wikipedia overview
            </a>
            .
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveIndustry;
