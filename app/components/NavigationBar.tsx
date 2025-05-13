import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface NavigationBarProps {
  defaultIndex: number;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ defaultIndex }) => {
  const isDefaultIndexNegative = defaultIndex === -1;
  return (
    <div
      className="flex items-center justify-between bg-white p-4 drop-shadow-orange rounded-lg"
      style={{ position: "relative", zIndex: 10 }}
    >
      <a href="/">
        <div className="flex items-left text-2xl">
          <img
            src="/images/coral-reef-logo.png"
            style={{ width: "5%", height: "auto" }}
            alt="Coral Reef Logo"
          />
          <h1 className = "text-dark-orange font-semibold pl-3 pt-2">Bergen Reef Accessing Data</h1>
        </div>
      </a>
      <div className="flex items-right justify-between">
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
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
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
                      ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                      : defaultIndex === 1
                      ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                      : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                  )}
                >
                  <span>Graphs</span>
                  <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
                <MenuItems
                  className="absolute z-50 right-0 mt-2 w-56 bg-light-gray shadow-lg ring-1 ring-black/5"
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
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
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
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
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
                      ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                      : defaultIndex === 1
                      ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                      : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                  )}
                >
                  <span>Graphs</span>
                  <ChevronDownIcon className="-mr-1 size-5 text-gray-400" />
                </MenuButton>
                <MenuItems
                  className="absolute z-50 right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50"
                  style={{ zIndex: 20 }}
                >
                  <MenuItem>
                    <a href="/data/linegraph">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-orange">
                        Line Graph
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/twodimgraph">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-orange">
                        Two Dimension Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/boxplot">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-orange">
                        Box Plot
                      </button>
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a href="/data/heatmap">
                      <button className="block w-full px-2 py-2 text-base text-gray font-semibold hover:bg-orange">
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
                          ? "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
                          : selected
                          ? "bg-orange outline outline-2 outline-dark-orange text-white font-bold"
                          : "bg-light-gray outline outline-1 outline-medium-gray drop-shadow-xl text-gray font-semibold hover:bg-orange"
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
