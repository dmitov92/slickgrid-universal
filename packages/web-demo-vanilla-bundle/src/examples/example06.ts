import {
  Column,
  convertHierarchicalViewToFlatArray,
  FieldType,
  findItemInHierarchicalStructure,
  GridOption,
  sortFlatArrayWithParentChildRef,
  Filters,
  Formatter,
  Formatters,
  sortHierarchicalArray,
  modifyDatasetToAddTreeItemsMapping,
  FilterCallbackArg,
  OperatorType,
  SortDirectionString,
  SortDirection,
} from '@slickgrid-universal/common';
import { Slicker } from '@slickgrid-universal/vanilla-bundle';
import './example06.scss';
import { ExampleGridOptions } from './example-grid-options';

export class Example6 {
  columnDefinitions: Column[];
  gridOptions: GridOption;
  datasetFlat: any[];
  datasetHierarchical = [];
  dataViewObj: any;
  gridObj: any;
  slickgridLwc;
  slickerGridInstance;
  durationOrderByCount = false;
  searchString = '';
  sortDirection: SortDirectionString = 'ASC';

  attached() {
    this.initializeGrid();
    this.datasetFlat = [];
    this.datasetHierarchical = this.mockDataset();
    const gridContainerElm = document.querySelector('.grid6');

    gridContainerElm.addEventListener('onclick', this.handleOnClick.bind(this));
    gridContainerElm.addEventListener('onslickergridcreated', this.handleOnSlickerGridCreated.bind(this));
    this.slickgridLwc = new Slicker.GridBundle(gridContainerElm, this.columnDefinitions, { ...ExampleGridOptions, ...this.gridOptions }, null, this.datasetHierarchical);
    this.dataViewObj = this.slickgridLwc.dataView;
    modifyDatasetToAddTreeItemsMapping(this.dataViewObj.getItems(), this.columnDefinitions[0], this.dataViewObj);
  }

  dispose() {
    this.slickgridLwc.dispose();
  }

  initializeGrid() {
    this.columnDefinitions = [
      {
        id: 'file', name: 'Files', field: 'file',
        type: FieldType.string, width: 150, formatter: this.treeFormatter,
        filterable: true, sortable: true,
        treeData: {
          // parentPropName: '__parentId',
          childrenPropName: 'files',
          // sortByFieldId: 'file',
          sortPropFieldType: FieldType.string,
        }
      },
      {
        id: 'dateModified', name: 'Date Modified', field: 'dateModified',
        formatter: Formatters.dateIso, sortable: true, type: FieldType.dateUtc, outputType: FieldType.dateIso, minWidth: 90,
        exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'size', name: 'Size', field: 'size', sortable: true, minWidth: 90,
        type: FieldType.number, exportWithFormatter: true,
        filterable: true, filter: { model: Filters.compoundInputNumber },
        formatter: (row, cell, value) => isNaN(value) ? '' : `${value} MB`,
      },
    ];

    this.gridOptions = {
      autoResize: {
        container: '.demo-container',
      },
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableFiltering: true,
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
    };
  }

  clearSearch() {
    this.searchFile(new KeyboardEvent('keyup', { code: '', bubbles: true, cancelable: true }));
    document.querySelector<HTMLInputElement>('input.search').value = '';
  }

  searchFile(event: KeyboardEvent) {
    this.searchString = (event.target as HTMLInputElement)?.value || '';
    this.updateFilter();
  }

  updateFilter() {
    const selectedColumn = this.columnDefinitions.find((col) => col.id === 'file');

    if (selectedColumn) {
      const fieldName = selectedColumn.id;
      const filter = {};
      const filterArg: FilterCallbackArg = {
        columnDef: selectedColumn,
        operator: OperatorType.contains,
        searchTerms: [this.searchString || '']
      };

      if (this.searchString) {
        // pass a columnFilter object as an object which it's property name must be a column field name (e.g.: 'duration': {...} )
        filter[fieldName] = filterArg;
      }

      this.dataViewObj.setFilterArgs({
        columnFilters: filter,
        grid: this.gridObj,
        dataView: this.dataViewObj,
      });
      this.dataViewObj.refresh();
    }
  }

  treeFormatter: Formatter = (row, cell, value, columnDef, dataContext, grid) => {
    const treeLevelPropName = columnDef.treeData?.levelPropName || '__treeLevel';
    if (value === null || value === undefined || dataContext === undefined) {
      return '';
    }
    const dataView = grid.getData();
    const data = dataView.getItems();
    const identifierPropName = dataView.getIdPropertyName() || 'id';
    const idx = dataView.getIdxById(dataContext[identifierPropName]);
    const prefix = this.getFileIcon(value);

    value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const spacer = `<span style="display:inline-block; width:${(15 * dataContext[treeLevelPropName])}px;"></span>`;

    if (data[idx + 1] && data[idx + 1][treeLevelPropName] > data[idx][treeLevelPropName]) {
      const folderPrefix = `<i class="mdi mdi-20px mdi-folder-outline"></i>`;
      if (dataContext.__collapsed) {
        return `${spacer} <span class="slick-group-toggle collapsed" level="${dataContext[treeLevelPropName]}"></span>${folderPrefix} ${prefix}&nbsp;${value}`;
      } else {
        return `${spacer} <span class="slick-group-toggle expanded" level="${dataContext[treeLevelPropName]}"></span>${folderPrefix} ${prefix}&nbsp;${value}`;
      }
    } else {
      return `${spacer} <span class="slick-group-toggle" level="${dataContext[treeLevelPropName]}"></span>${prefix}&nbsp;${value}`;
    }
  }

  getFileIcon(value: string) {
    let prefix = '';
    if (value.includes('.pdf')) {
      prefix = '<i class="has-text-danger mdi mdi-20px mdi-file-pdf-outline"></i>';
    } else if (value.includes('.txt')) {
      prefix = '<i class="mdi mdi-20px mdi-file-document-outline"></i>';
    } else if (value.includes('.xls')) {
      prefix = '<i class="has-text-success mdi mdi-20px mdi-file-excel-outline"></i>';
    } else if (value.includes('.mp3')) {
      prefix = '<i class="has-text-info mdi mdi-20px mdi-file-music-outline"></i>';
    }
    return prefix;
  }

  /**
   * A simple method to add a new item inside the first group that we find.
   * After adding the item, it will sort by parent/child recursively
   */
  addNewFile() {
    const newId = this.datasetFlat.length + 100;

    // find first parent object and add the new item as a child
    const popItem = findItemInHierarchicalStructure(this.datasetHierarchical, x => x.file === 'pop', 'files');

    if (popItem && Array.isArray(popItem.files)) {
      popItem.files.push({
        id: newId,
        file: `pop${Math.round(Math.random() * 100)}.mp3`,
        dateModified: new Date(),
        size: Math.round(Math.random() * 100),
      });
      const sortedArray = sortHierarchicalArray(this.datasetHierarchical, { sortByFieldId: 'file' });
      this.datasetFlat = convertHierarchicalViewToFlatArray(sortedArray, { childrenPropName: 'files' });

      // update dataset and re-render (invalidate) the grid
      this.slickgridLwc.dataset = this.datasetFlat;
      this.gridObj.invalidate();

      // scroll to bottom of the grid
      this.gridObj.navigateBottom();
    }
  }

  collapseAll() {
    this.datasetFlat.forEach((item) => item.__collapsed = true);
    this.slickgridLwc.dataset = this.datasetFlat;
    this.gridObj.invalidate();
  }

  expandAll() {
    this.datasetFlat.forEach((item) => item.__collapsed = false);
    this.slickgridLwc.dataset = this.datasetFlat;
    this.gridObj.invalidate();
  }

  resortTreeGrid(inputFlatArray?: any[], direction?: SortDirection | SortDirectionString) {
    const datasetFlat = inputFlatArray || this.datasetFlat;

    const sortedOutputArray = sortFlatArrayWithParentChildRef(datasetFlat, { ...this.columnDefinitions[0].treeData, direction: direction ?? 'ASC' });
    this.gridObj.resetActiveCell();
    this.datasetFlat = sortedOutputArray;
    this.slickgridLwc.dataset = sortedOutputArray;
    this.gridObj.invalidate();
  }

  toggleSort() {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.resortTreeGrid(this.datasetFlat, this.sortDirection);
    this.gridObj.setSortColumns([
      { columnId: 'file', sortAsc: (this.sortDirection === 'ASC') },
    ]);
  }

  handleOnClick(event: any) {
    const eventDetail = event?.detail;
    const args = event?.detail?.args;

    if (eventDetail && args) {
      const targetElm = eventDetail.eventData.target || {};
      const hasToggleClass = targetElm.className.indexOf('toggle') >= 0 || false;
      if (hasToggleClass) {
        const item = this.dataViewObj.getItem(args.row);
        if (item) {
          item.__collapsed = !item.__collapsed ? true : false;
          this.dataViewObj.updateItem(item.id, item);
          this.gridObj.invalidate();
        }
        event.stopImmediatePropagation();
      }
    }
  }

  handleOnSlickerGridCreated(event) {
    this.slickerGridInstance = event && event.detail;
    this.gridObj = this.slickerGridInstance && this.slickerGridInstance.slickGrid;
    this.dataViewObj = this.slickerGridInstance && this.slickerGridInstance.dataView;
  }

  logExpandedStructure() {
    console.log('exploded array', this.slickgridLwc.datasetHierarchical /* , JSON.stringify(explodedArray, null, 2) */);

  }

  logFlatStructure() {
    console.log('flat array', this.dataViewObj.getItems() /* , JSON.stringify(outputFlatArray, null, 2) */);
  }

  mockDataset() {
    return [
      { id: 18, file: 'something.txt', dateModified: '2015-03-03T03:50:00.123Z', size: 90 },
      {
        id: 21, file: 'Documents', files: [
          { id: 2, file: 'txt', files: [{ id: 3, file: 'todo.txt', dateModified: '2015-05-12T14:50:00.123Z', size: 0.7, }] },
          {
            id: 4, file: 'pdf', files: [
              { id: 5, file: 'map.pdf', dateModified: '2015-05-21T10:22:00.123Z', size: 3.1, },
              { id: 6, file: 'internet-bill.pdf', dateModified: '2015-05-12T14:50:00.123Z', size: 1.4, },
              { id: 22, file: 'phone-bill.pdf', dateModified: '2015-05-01T07:50:00.123Z', size: 1.4, },
            ]
          },
          { id: 9, file: 'misc', files: [{ id: 10, file: 'something.txt', dateModified: '2015-02-26T16:50:00.123Z', size: 0.4, }] },
          { id: 7, file: 'xls', files: [{ id: 8, file: 'compilation.xls', dateModified: '2014-10-02T14:50:00.123Z', size: 2.3, }] },
        ]
      },
      {
        id: 11, file: 'Music', files: [{
          id: 12, file: 'mp3', files: [
            { id: 16, file: 'rock', files: [{ id: 17, file: 'soft.mp3', dateModified: '2015-05-13T13:50:00Z', size: 98, }] },
            { id: 14, file: 'pop', files: [{ id: 15, file: 'theme.mp3', dateModified: '2015-03-01T17:05:00Z', size: 85, }] },
          ]
        }]
      },
    ];
  }
}
