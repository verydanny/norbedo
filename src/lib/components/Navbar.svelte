<header class="bg-base-200">
    <div class="lg:divide-base-300 mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:px-8">
        <div class="relative flex h-16 justify-between">
            <div class="relative z-10 flex px-2 lg:px-0">
                <div class="flex shrink-0 items-center">
                    <img
                        class="h-8 w-auto"
                        src="https://storage.norbedo.com/storage/uploads/app-app/assets/mark.svg"
                        alt="Your Company"
                    />
                </div>
            </div>
            <div
                class="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0"
            >
                <div class="grid w-full grid-cols-1 sm:max-w-xs">
                    <input
                        type="search"
                        name="search"
                        aria-label="Search"
                        class="bg-base-300 text-base-content placeholder:text-base-content/50 focus:bg-base-100 focus:text-base-content focus:placeholder:text-base-content/50 col-start-1 row-start-1 block w-full rounded-md py-1.5 pr-3 pl-10 text-base outline-hidden sm:text-sm/6"
                        placeholder="Search"
                    />
                    <svg
                        class="text-base-content/50 pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
            </div>
            <div class="relative z-10 flex items-center lg:hidden">
                <!-- Mobile menu button -->
                <button
                    type="button"
                    class="text-base-content/70 hover:bg-base-300 hover:text-base-content focus:ring-primary relative inline-flex items-center justify-center rounded-md p-2 focus:ring-2 focus:outline-hidden focus:ring-inset"
                    aria-controls="mobile-menu"
                    aria-expanded="false"
                >
                    <span class="absolute -inset-0.5"></span>
                    <span class="sr-only">Open menu</span>
                    <!--
              Icon when menu is closed.
  
              Menu open: "hidden", Menu closed: "block"
            -->
                    <svg
                        class="block size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        ></path>
                    </svg>
                    <!--
              Icon when menu is open.
  
              Menu open: "block", Menu closed: "hidden"
            -->
                    <svg
                        class="hidden size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
            </div>
            <div class="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center">
                <button
                    type="button"
                    class="bg-base-200 text-base-content/70 hover:text-base-content focus:ring-primary focus:ring-offset-base-200 relative shrink-0 rounded-full p-1 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                >
                    <span class="absolute -inset-1.5"></span>
                    <span class="sr-only">View notifications</span>
                    <svg
                        class="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        ></path>
                    </svg>
                </button>

                <!-- Profile dropdown -->
                <div class="relative ml-4 shrink-0">
                    <div>
                        <button
                            type="button"
                            class="bg-base-200 text-base-content focus-visible:ring-primary focus-visible:ring-offset-base-200 relative flex rounded-full text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2"
                            id="user-menu-button"
                            aria-expanded="false"
                            aria-haspopup="true"
                        >
                            <span class="absolute -inset-1.5"></span>
                            <span class="sr-only">Open user menu</span>
                            <img
                                class="size-8 rounded-full"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            />
                        </button>
                    </div>

                    <!--
              Dropdown menu, show/hide based on menu state.
  
              Entering: "transition ease-out duration-100"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            -->
                    <div
                        class="bg-base-100 ring-base-300 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 focus:outline-hidden"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        tabindex="-1"
                    >
                        <!-- Active: "bg-base-200 outline-hidden", Not Active: "" -->
                        <a
                            href="#top"
                            class="text-base-content hover:bg-base-200 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="user-menu-item-0"
                        >
                            Your Profile
                        </a>
                        <a
                            href="#top"
                            class="text-base-content hover:bg-base-200 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="user-menu-item-1"
                        >
                            Settings
                        </a>
                        <a
                            href="#top"
                            class="text-base-content hover:bg-base-200 block px-4 py-2 text-sm"
                            role="menuitem"
                            tabindex="-1"
                            id="user-menu-item-2"
                        >
                            Sign out
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <nav class="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
            <!-- Current: "bg-primary text-primary-content", Default: "text-base-content/70 hover:bg-base-300 hover:text-base-content" -->
            <a
                href="#top"
                class="bg-primary text-primary-content inline-flex items-center rounded-md px-3 py-2 text-sm font-medium"
                aria-current="page"
            >
                Dashboard
            </a>
            <a
                href="#top"
                class="text-base-content/70 hover:bg-base-300 hover:text-base-content inline-flex items-center rounded-md px-3 py-2 text-sm font-medium"
            >
                Team
            </a>
            <a
                href="#top"
                class="text-base-content/70 hover:bg-base-300 hover:text-base-content inline-flex items-center rounded-md px-3 py-2 text-sm font-medium"
            >
                Projects
            </a>
            <a
                href="#top"
                class="text-base-content/70 hover:bg-base-300 hover:text-base-content inline-flex items-center rounded-md px-3 py-2 text-sm font-medium"
            >
                Calendar
            </a>
        </nav>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <nav class="lg:hidden" aria-label="Global" id="mobile-menu">
        <div class="space-y-1 px-2 pt-2 pb-3">
            <!-- Current: "bg-primary text-primary-content", Default: "text-base-content/70 hover:bg-base-300 hover:text-base-content" -->
            <a
                href="#top"
                class="bg-primary text-primary-content block rounded-md px-3 py-2 text-base font-medium"
                aria-current="page"
            >
                Dashboard
            </a>
            <a
                href="#top"
                class="text-base-content/70 hover:bg-base-300 hover:text-base-content block rounded-md px-3 py-2 text-base font-medium"
            >
                Team
            </a>
            <a
                href="#top"
                class="text-base-content/70 hover:bg-base-300 hover:text-base-content block rounded-md px-3 py-2 text-base font-medium"
            >
                Projects
            </a>
            <a
                href="#top"
                class="text-base-content/70 hover:bg-base-300 hover:text-base-content block rounded-md px-3 py-2 text-base font-medium"
            >
                Calendar
            </a>
        </div>
        <div class="border-base-300 border-t pt-4 pb-3">
            <div class="flex items-center px-4">
                <div class="shrink-0">
                    <img
                        class="size-10 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                    />
                </div>
                <div class="ml-3">
                    <div class="text-base-content text-base font-medium">Tom Cook</div>
                    <div class="text-base-content/70 text-sm font-medium">tom@example.com</div>
                </div>
                <button
                    type="button"
                    class="bg-base-200 text-base-content/70 hover:text-base-content focus:ring-primary focus:ring-offset-base-200 relative ml-auto shrink-0 rounded-full p-1 focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
                >
                    <span class="absolute -inset-1.5"></span>
                    <span class="sr-only">View notifications</span>
                    <svg
                        class="size-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        ></path>
                    </svg>
                </button>
            </div>
            <div class="mt-3 space-y-1 px-2">
                <a
                    href="#top"
                    class="text-base-content/70 hover:bg-base-300 hover:text-base-content block rounded-md px-3 py-2 text-base font-medium"
                >
                    Your Profile
                </a>
                <a
                    href="#top"
                    class="text-base-content/70 hover:bg-base-300 hover:text-base-content block rounded-md px-3 py-2 text-base font-medium"
                >
                    Settings
                </a>
                <a
                    href="#top"
                    class="text-base-content/70 hover:bg-base-300 hover:text-base-content block rounded-md px-3 py-2 text-base font-medium"
                >
                    Sign out
                </a>
            </div>
        </div>
    </nav>
</header>
