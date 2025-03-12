import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import clsx from 'clsx';
import { Fragment } from 'react';

interface NavigationBarProps {
  defaultIndex: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ defaultIndex }) => {
  const isDefaultIndexNegative = defaultIndex === -1;
  return (
    <div className="flex items-center justify-between bg-white p-4 drop-shadow-orange rounded-lg">
      <a href="/">
        <div className="text-3xl">
          <img src="/images/coral-reef-logo.png" style={{ width: '5%', height: 'auto' }} alt="Coral Reef Logo" />
        </div>
      </a>
      <div className="flex items-right justify-between">
        <a href="/profile">
          <div className="pt-1.5 pr-8">
            <UserCircleIcon className={clsx('size-8', isDefaultIndexNegative ? 'text-dark-orange' : 'text-orange')} />
          </div>
        </a>
        {isDefaultIndexNegative ? (
          <TabGroup>
            <TabList className="flex space-x-4">
              <a href="/">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        'tab-item px-6 py-2 rounded-full transition',
                        false
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-orange outline outline-2 outline-dark-orange text-dark-gray font-semibold hover:bg-medium-orange"
                      )}
                    >
                      Home
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/data">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        'tab-item px-6 py-2 rounded-full transition',
                        selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-2 outline-medium-gray text-gray font-semibold hover:bg-orange"
                      )}
                    >
                      Data
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/history">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        'tab-item px-6 py-2 rounded-full transition',
                        selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-2 outline-medium-gray text-gray font-semibold hover:bg-orange"
                      )}
                    >
                      History
                    </button>
                  )}
                </Tab>
              </a>
            </TabList>
          </TabGroup>
        ) : (
          <TabGroup defaultIndex={defaultIndex}>
            <TabList className="flex space-x-4">
              <a href="/">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        'tab-item px-6 py-2 rounded-full transition',
                        selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-2 outline-medium-gray text-gray font-semibold hover:bg-orange"
                      )}
                    >
                      Home
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/data">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        'tab-item px-6 py-2 rounded-full transition',
                        selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-2 outline-medium-gray text-gray font-semibold hover:bg-orange"
                      )}
                    >
                      Data
                    </button>
                  )}
                </Tab>
              </a>
              <a href="/history">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        'tab-item px-6 py-2 rounded-full transition',
                        selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-2 outline-medium-gray text-gray font-semibold hover:bg-orange"
                      )}
                    >
                      History
                    </button>
                  )}
                </Tab>
              </a>
            </TabList>
          </TabGroup>
        )}
      </div>
    </div>
  );
};

export default NavigationBar; 