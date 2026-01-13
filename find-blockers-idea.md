Type Component:
  Name: 'string'
  SubComponents: ['string']
  Dependencies: ['Dependencies']
  Converted: 'boolean'

Type Dependencies:
  Implementation: ['string']
  Icons: ['string']
  Demo: ['string']
  DemoIcons: ['string']

Example dataset:


Components:                             # Type: Array of Component
  - Spinner:
    Dependencies:                       # Type: Dependencies
      SubComponents:                    # Type: Array of strings | null. From import statements in the component file
      Implementation:                   # Type: Array of Objects | null. From import statements in the component file
      Icons:                            # Type: Array of strings | null. From import statements in the component file (listed once per icon, even if they are used multiple times)
      Demo:                             # Type: Array of Objects | null. From import statements in the demo files
        - Content                       # Style Components gets ignored but we list it anyways
      DemoIcons:                        # Type: Array of strings | null. From import statements in the demo files (listed once per icon, even if they are used multiple times)
    Converted: false
  - Button:
    Dependencies:                       # Type: Dependencies
      SubComponents:                    # Type: Array of strings | null. From import statements in the component file
      Implementation:                   # Type: Array of strings | null. From import statements in the component file
        - Badge
        - Spinner
      Icons:                            # Type: Array of strings | null. From import statements in the component file (listed once per icon, even if they are used multiple times)
        - StarIcon
        - OutlinedStarIcon
        - CogIcon
        - hamburgerIcon
      Demo:                             # Type: Array of strings | null. From import statements in the demo files
        - Flex                          # Layout Components gets ignored but we list it anyways
        - Tooltip
      DemoIcons:                        # Type: Array of strings | null. From import statements in the demo files (listed once per icon, even if they are used multiple times)
          - PlusCircleIcon
          - ArrowRightIcon
          - TimesIcon
          - PlusCircleIcon
          - CopyIcon
          - UploadIcon
          - BellIcon
          - QuestionCircleIcon
          - ExternalLinkSquareAltIcon
    Converted: false
  - MenuToggle:
    Dependencies:                       # Type: Dependencies
      SubComponents:                    # Type: Array of strings | null. From import statements in the component file
        - MenuToggleCheckbox
        - MenuToggleAction
      Implementation:                   # Type: Array of strings | null. From import statements in the component file
      Icons:                            # Type: Array of strings | null. From import statements in the component file (listed once per icon, even if they are used multiple times)
      Demo:                             # Type: Array of strings | null. From import statements in the demo files
        - HelperText
      DemoIcons:                        # Type: Array of strings | null. From import statements in the demo files (listed once per icon, even if they are used multiple times)
          - PlusIcon
    Converted: false
  - Menu:
    Dependencies:                       # Type: Dependencies
      SubComponents:                    # Type: Array of strings | null. From import statements in the component file, will also show up in demo files as imports
        - MenuBreadcrumb
        - MenuContainer
        - MenuContext
        - MenuFooter
        - MenuGroup
        - MenuItem
        - MenuItemAction
        - MenuList
        - MenuSearch
        - MenuSearchInput
      Implementation:                   # Type: Array of strings | null. From import statements in the component file
        - Tooltip
      Icons:                            # Type: Array of strings | null. From import statements in the component file (listed once per icon, even if they are used multiple times)
      Demo:                             # Type: Array of strings | null. From import statements in the demo files
        - Divider
        - DrilldownMenu
        - SearchInput
        - Badge
        - Breadcrumb
        - BreadcrumbHeading
        - BreadcrumbItem
        - Checkbox
        - Dropdown
        - DropdownItem
        - DropdownList
        - Icon
        - Button
        - Spinner
      DemoIcons:                        # Type: Array of strings | null. From import statements in the demo files (listed once per icon, even if they are used multiple times)
        - TableIcon
        - BarsIcon
        - ClipboardIcon
        - CodeBranchIcon
        - BellIcon
        - StorageDomainIcon
        - CodeBranchIcon
        - LayerGroupIcon
        - CubeIcon
        - AngleLeftIcon
        - BellsIcon
    Converted: false
  - Select:
    Dependencies:                       # Type: Dependencies
      SubComponents:                    # Type: Array of strings | null. From import statements in the component file
        - SelectGroup
        - SelectOption
        - SelectList
      Implementation:                   # Type: Array of strings | null. From import statements in the component file
        - Menu
        - MenuContent
        - MenuProps
      Icons:                            # Type: Array of strings | null. From import statements in the component file (listed once per icon, even if they are used multiple times)
      Demo:                             # Type: Array of strings | null. From import statements in the demo files
        - MenuToggle
        - MenuFooter
        - MenuToggleElement
        - Checkbox
        - Badge
        - Button
        - Divider
        - TextInputGroup
        - TextInputGroupMain
        - TextInputGroupUtilities
        - Label
        - LabelGroup
        - Button
        - HelperText
        - HelperTextItem
      DemoIcons:                        # Type: Array of strings | null. From import statements in the demo files (listed once per icon, even if they are used multiple times)
        - TimesIcon
        - BellIcon
    Converted: false
