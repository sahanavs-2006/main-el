const ResultsSection = ({ results }) => {
  if (!results) return null;

  const isError = results.status === 'error';

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-800 mb-3">❌ Error Occurred</h3>
          <p className="text-red-700 mb-2">
            <strong>English:</strong> {results.error}
          </p>
          {results.error_kannada && (
            <p className="text-red-700 kannada-text">
              <strong>ಕನ್ನಡ:</strong> {results.error_kannada}
            </p>
          )}
          {results.note && (
            <p className="text-red-600 mt-2 italic text-sm">{results.note}</p>
          )}
        </div>
      )}

      {/* Original Input */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
        <h3 className="text-xl font-bold text-teal-800 mb-3">📝 Original Input</h3>
        <p className="text-lg kannada-text">{results.kannada_description}</p>
      </div>

      {/* English Translation */}
      {results.english_description && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cyan-500">
          <h3 className="text-xl font-bold text-cyan-800 mb-3">🔤 English Translation</h3>
          <p className="text-lg">{results.english_description}</p>
        </div>
      )}

      {/* Generated Code */}
      {results.generated_code && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-bold text-green-800 mb-3">💻 Generated Python Code</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code>{results.generated_code}</code>
          </pre>
        </div>
      )}

      {/* Trinket IO Execution */}
      {results.trinket_embed_url && results.execution_environment === 'trinket_io' && !isError && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-emerald-500">
          <h3 className="text-xl font-bold text-emerald-800 mb-3">
            ▶️ Interactive Execution (Trinket IO)
          </h3>
          <p className="text-gray-600 mb-4">You can run and modify the code below:</p>
          <div
            className="border-2 border-emerald-200 rounded-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: results.trinket_iframe_html }}
          />
          {results.validation_output && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm font-semibold text-green-800">✅ Validation Output:</p>
              <pre className="text-sm text-green-700 mt-1">{results.validation_output}</pre>
            </div>
          )}
        </div>
      )}

      {/* Local Execution Results */}
      {results.execution_environment === 'local' && !isError && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-teal-500">
          <h3 className="text-xl font-bold text-teal-800 mb-3">▶️ Execution Result (Local)</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${results.execution_status === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}>
                {results.execution_status === 'success' ? '✅ Success' : '❌ Failed'}
              </span>
            </div>

            {results.output && (
              <div>
                <p className="font-semibold mb-2">📤 Output:</p>
                <pre className="bg-gray-100 p-3 rounded border border-gray-300 text-sm">
                  {results.output}
                </pre>
              </div>
            )}

            {results.error && (
              <>
                <div>
                  <p className="font-semibold text-red-700">❌ Error:</p>
                  <p className="text-red-600 mt-1">{results.error}</p>
                </div>
                {results.error_kannada && (
                  <div>
                    <p className="font-semibold text-red-700 kannada-text">❌ ದೋಷ:</p>
                    <p className="text-red-600 mt-1 kannada-text">{results.error_kannada}</p>
                  </div>
                )}
              </>
            )}

            {results.execution_time && (
              <div className="text-sm text-gray-600">
                ⏱️ <strong>Execution Time:</strong> {results.execution_time}s
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
