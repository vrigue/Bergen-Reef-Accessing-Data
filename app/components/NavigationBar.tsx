import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface NavigationBarProps {
  defaultIndex: number;
  username: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ defaultIndex, username }) => {
  const isDefaultIndexNegative = defaultIndex === -1;
  return (
    <div
      className="flex items-center justify-between bg-white p-4 drop-shadow-orange rounded-lg"
      style={{ position: "relative", zIndex: 10 }}
    >
      <a href="/">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/images/coral-reef-logo.png"
          className="w-8 sm:w-10 md:w-12 h-auto"
          alt="Coral Reef Logo"
        />
        <h1 className="text-dark-orange font-semibold text-base sm:text-xl md:text-2xl whitespace-nowrap truncate min-w-0">
          Bergen Reef Accessing Data
        </h1>
      </div>
      </a>
      <div className="flex items-right justify-between">
      <h1 className="text-base sm:text-lg md:text-xl text-dark-orange font-semibold pr-5 pt-2 whitespace-nowrap">Welcome {username}!</h1>
        <a href="/profile">
          <div className="pt-1.5 pr-8">
            <UserCircleIcon
              className={clsx(
                "size-8",
                isDefaultIndexNegative ? "text-dark-orange" : "text-orange"
              )}
            />
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
                        "tab-item px-6 py-2 rounded-xl transition",
                        isDefaultIndexNegative
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                      )}
                    >
                      Home
                    </button>
                  )}
                </Tab>
              </a>
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton
                  className={clsx(
                    "tab-item px-6 py-2 rounded-xl transition flex items-center justify-between",
                    isDefaultIndexNegative
                      ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                      : defaultIndex === 1
                      ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                      : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                  )}
                >
                  <span>Graphs</span>
                  <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
                <MenuItems
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50"
                  style={{ zIndex: 20 }}
                >
                  <MenuItem>
                    <a href="/data/linegraph">
                      <button className="block w-full px-4 py-2 text-base text-gray font-semibold hover:bg-gray-100">
                        Line Graph
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/twodimgraph">
                      <button className="block w-full px-4 py-2 text-base text-gray font-semibold hover:bg-gray-100">
                        Two Dimension Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/boxplot">
                      <button className="block w-full px-4 py-2 text-sm text-gray font-semibold hover:bg-gray-100">
                        Box Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/heatmap">
                      <button className="block w-full px-4 py-2 text-sm text-gray font-semibold hover:bg-gray-100">
                        Heat Map
                      </button>
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
              <a href="/history">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-xl transition",
                        isDefaultIndexNegative
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
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
                        "tab-item px-6 py-2 rounded-xl transition",
                        isDefaultIndexNegative
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                      )}
                    >
                      Home
                    </button>
                  )}
                </Tab>
              </a>
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton
                  className={clsx(
                    "tab-item px-6 py-2 rounded-xl transition flex items-center justify-between",
                    isDefaultIndexNegative
                      ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                      : defaultIndex === 1
                      ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                      : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                  )}
                >
                  <span>Graphs</span>
                  <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
                <MenuItems
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50"
                  style={{ zIndex: 20 }}
                >
                  <MenuItem>
                    <a href="/data/linegraph">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-medium-orange">
                        Line Graph
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/twodimgraph">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-medium-orange">
                        Two Dimension Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/boxplot">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-medium-orange">
                        Box Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/heatmap">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-medium-orange">
                        Heat Map
                      </button>
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
              <a href="/history">
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      className={clsx(
                        "tab-item px-6 py-2 rounded-xl transition",
                        isDefaultIndexNegative || defaultIndex === 1
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-medium-orange"
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
