import { SignOutButton } from './SignOutButton';
import Image from 'next/image';

type HeaderProps = {
  isAuthenticated: boolean;
};

export function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src="/app-logo.svg"
              alt="App Icon"
              width={40}
              height={40}
              className="w-8 h-8"
            />
            <h1 className="text-xl font-semibold text-gray-900">
              Demo Application
            </h1>
          </div>
          {isAuthenticated ? <SignOutButton /> : <></>}
        </div>
      </div>
    </header>
  );
}
