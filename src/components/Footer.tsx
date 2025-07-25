import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Powered by</span>
            <Image
              src="/zitadel-logo.svg"
              alt="Zitadel"
              width={295}
              height={81}
              className="h-12 w-auto"
            />
          </div>
          <div className="flex items-start max-w-2xl">
            <div className="ml-3">
              <p className="text-sm text-gray-600 text-right">
                <strong className="text-gray-800">Disclaimer:</strong>
                This is a demonstration application for reference purposes only.
                Do not use this code in production environments without proper
                security review and modifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
