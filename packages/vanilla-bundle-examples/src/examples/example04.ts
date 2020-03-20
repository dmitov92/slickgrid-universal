import { GridOption } from '@slickgrid-universal/common';
import { Slicker } from '@slickgrid-universal/vanilla-bundle';
import './example04.scss';

export class Example4 {
  gridClass;
  gridClassName;
  _commandQueue = [];
  columnDefinitions;
  gridOptions: GridOption;
  dataset;
  dataViewObj: any;
  gridObj: any;
  commandQueue = [];
  slickgridLwc;
  slickerGridInstance;
  durationOrderByCount = false;
  draggableGroupingPlugin: any;
  selectedGroupingFields: string[] = ['', '', ''];
  searchString = '';

  attached() {
    this.initializeGrid();
    this.dataset = [];
    const gridContainerElm = document.querySelector(`.grid3`);
    const gridElm = document.querySelector(`.slickgrid-container`);

    gridContainerElm.addEventListener('onclick', this.handleOnClick.bind(this));
    gridContainerElm.addEventListener('onvalidationerror', this.handleValidationError.bind(this));
    gridContainerElm.addEventListener('onrowcountchanged', this.handleOnRowCountChanged.bind(this));
    gridContainerElm.addEventListener('handleonrowschanged', this.handleOnRowsChanged.bind(this));
    gridContainerElm.addEventListener('onitemdeleted', this.handleItemDeleted.bind(this));
    gridContainerElm.addEventListener('onslickergridcreated', this.handleOnSlickerGridCreated.bind(this));
    this.slickgridLwc = new Slicker.GridBundle(gridContainerElm, this.columnDefinitions, this.gridOptions);
    this.dataViewObj = this.slickgridLwc.dataView;
    this.dataViewObj.setFilter(this.myFilter.bind(this));
    this.dataset = this.mockDataset();
    this.slickgridLwc.dataset = this.dataset;
  }

  initializeGrid() {
    this.columnDefinitions = [
      { id: "title", name: "Title", field: "title", width: 220, cssClass: "cell-title", filterable: true, formatter: this.taskNameFormatter.bind(this), editor: Slicker.Editors.text },
      { id: "duration", name: "Duration", field: "duration", editor: Slicker.Editors.text, minWidth: 90 },
      { id: "%", name: "% Complete", field: "percentComplete", width: 120, resizable: false, formatter: Slicker.Formatters.percentCompleteBar, editor: Slicker.Editors.slider },
      { id: "start", name: "Start", field: "start", minWidth: 60 },
      { id: "finish", name: "Finish", field: "finish", minWidth: 60 },
      {
        id: "effort-driven", name: "Effort Driven", width: 80, minWidth: 20, maxWidth: 80, cssClass: "cell-effort-driven", field: "effortDriven",
        formatter: Slicker.Formatters.checkmarkMaterial, editor: Slicker.Editors.checkbox, cannotTriggerInsert: true
      }
    ];

    this.gridOptions = {
      autoEdit: true, // true single click (false for double-click)
      autoCommitEdit: true,
      asyncEditorLoading: false,
      editable: true,
      autoResize: {
        container: '.demo-container',
      },
      dataView: {
        inlineFilters: false
      },
      // enableFiltering: true,
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      // enableCellNavigation: true,
      enableGrouping: true,
      enableRowSelection: true,
      // enableCheckboxSelector: true,
      formatterOptions: {
        minDecimal: 0,
        maxDecimal: 2,
        thousandSeparator: ','
      },
      rowSelectionOptions: {
        selectActiveRow: false // False for Multiple Selections
      },
      sanitizer: (dirtyHtml) => (dirtyHtml.replace(/(\b)(on\S+)(\s*)=|javascript|(<\s*)(\/*)script/gi, '')),
      enableSorting: true,
      headerRowHeight: 45,
      rowHeight: 45,
      editCommandHandler: (item, column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
    };
  }

  dispose() {
    this.slickgridLwc.dispose();
  }

  searchTask(event: KeyboardEvent) {
    this.searchString = (event.target as HTMLInputElement).value;
    this.dataViewObj.refresh();
  }

  taskNameFormatter(row, cell, value, columnDef, dataContext) {
    if (value == null || value == undefined || dataContext === undefined) { return ''; }

    value = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const spacer = `<span style="display:inline-block;height:1px;width:${15 * dataContext["indent"]}px"></span>`;
    const idx = this.dataViewObj.getIdxById(dataContext.id);
    if (this.dataset[idx + 1] && this.dataset[idx + 1].indent > this.dataset[idx].indent) {
      if (dataContext._collapsed) {
        return `${spacer}<span class="toggle expand"></span>&nbsp;${value}`;
      } else {
        return `${spacer}<span class="toggle collapse"></span>&nbsp;${value}`;
      }
    } else {
      return `${spacer}<span class="toggle"></span>&nbsp;${value}`;
    }
  }

  myFilter(item) {
    // if (item["percentComplete"] < percentCompleteThreshold) {
    //   return false;
    // }

    if (this.searchString != "" && item["title"].indexOf(this.searchString) == -1) {
      return false;
    }

    if (item.parent != null) {
      var parent = this.dataset[item.parent];
      while (parent) {
        if (parent._collapsed || /*(parent["percentComplete"] < percentCompleteThreshold) ||*/ (this.searchString != "" && parent["title"].indexOf(this.searchString) == -1)) {
          return false;
        }
        parent = this.dataset[parent.parent];
      }
    }
    return true;
  }

  customBlankFormatter() {
    return '';
  }

  customAceGroupingFormatter(totals, columnDef) {
    const hasAce = totals.clone && totals.clone[columnDef.field];
    return !hasAce ? '' : `<i class="mdi mdi-check checkmark-icon green" style="color: #4DCAA9; font-size: 20px" aria-hidden="true"></i>`;
  }

  customCheckmarGroupingFormatter(totals, columnDef) {
    const hasAce = totals.clone && totals.clone[columnDef.field];
    return !hasAce ? '' : `<i class="mdi mdi-check checkmark-icon" style="font-size: 20px" aria-hidden="true"></i>`;
  }

  customQuantityGroupingFormatter(totals, columnDef) {
    return totals.min && totals.min[columnDef.field] || '';
  }

  customLineTypeGroupingFormatter(totals, columnDef) {
    const val = totals.clone && totals.clone[columnDef.field];
    let output = '';
    switch (val) {
      case 'Profiled':
        output = `<i class="mdi mdi-pencil" style="cursor: pointer; font-size: 20px" aria-hidden="true" onclick="alert('call update line modal window')"></i>`;
        break;
      case 'Selector':
        output = `<i class="mdi mdi-cogs" style="cursor: pointer; font-size: 20px" aria-hidden="true" onclick="alert('validate selector')"></i>`;
        break;
      default:
        output = '';
        break;
    }
    return output;
  }

  customTranslationTypeGroupingFormatter(totals, columnDef) {
    const val = totals.clone && totals.clone[columnDef.field];
    let output = '';
    switch (val) {
      case 'Drawing':
        output = `<i class="mdi mdi-file-send-outline" style="font-size: 20px" aria-hidden="true"></i>`;
        break;
      default:
        output = '';
        break;
    }
    return output;
  }

  customProductGroupingFormatter(totals, columnDef) {
    const val = totals.clone && totals.clone['productGroup'];
    return val ? `<b>${val}</b>` : '';
  }

  addNewRow() {
    const id = (Math.round(Math.random() * 10000));
    const newIndent = 1;


    // find first parent object and add the new item as a child
    const childItemFound = this.dataset.find((item) => item.indent === newIndent);
    const parentItemFound = this.dataViewObj.getItemByIdx(childItemFound.parent);
    const idx = this.dataViewObj.getIdxById(childItemFound.id);

    console.log(childItemFound, parentItemFound)
    const itemAfterLast = this.dataset.find((item) => item.indent === (newIndent + 1));
    const itemAfterLastIdx = this.dataViewObj.getIdxById(itemAfterLast.id) - 1;
    console.log('last item', itemAfterLast)

    // find the last item in the same indented group
    let nextOutsideItemIdx;
    for (let i = idx; i < this.dataset.length; i++) {
      const loopItem = this.dataset[i];
      // if (loopItem.parent !== parentItemFound.id) {
      //   continue;
      // }
      if (loopItem.indent !== newIndent) {

        nextOutsideItemIdx = i;
        break;
      }
    }

    console.log(nextOutsideItemIdx, this.dataset[nextOutsideItemIdx])
    const newItem = {
      id,
      parent: parentItemFound.id.replace('id_', ''),
      indent: newIndent,
      title: `Task${id}`,
      duration: '1 day',
      percentComplete: 0,
      start: '01/01/2009',
      finish: '01/01/2009',
      effortDriven: false
    };
    this.dataViewObj.insertItem(idx, newItem);
    console.log('new item', newItem)
  }

  handleOnClick(event: any) {
    const eventDetail = event?.detail;
    const args = event?.detail?.args;
    console.log(eventDetail)
    console.log('onclick', $(eventDetail.eventData.target), $(eventDetail.eventData).hasClass("toggle"))
    if ($(eventDetail.eventData.target).hasClass("toggle")) {
      var item = this.dataViewObj.getItem(args.row);
      console.log(item)
      if (item) {
        if (!item._collapsed) {
          item._collapsed = true;
        } else {
          item._collapsed = false;
        }

        this.dataViewObj.updateItem(item.id, item);
      }
      event.stopImmediatePropagation();
    }
  }

  // wire up model events to drive the grid
  handleOnRowCountChanged() {
    console.log('handleOnRowCountChanged')
    if (this.gridObj) {
      this.gridObj.updateRowCount();
      this.gridObj.render();
    }
  };

  handleOnRowsChanged(event: any) {
    console.log('handleOnRowsChanged')
    const args = event?.detail?.args;
    if (this.gridObj) {
      this.gridObj.invalidateRows(args.rows);
      this.gridObj.render();
    }
  };

  handleValidationError(event) {
    console.log('handleValidationError', event.detail);
    const args = event.detail && event.detail.args;
    if (args.validationResults) {
      alert(args.validationResults.msg);
    }
  }

  handleItemDeleted(event) {
    const itemId = event && event.detail;
    console.log('item deleted with id:', itemId);
  }

  handleOnSlickerGridCreated(event) {
    this.slickerGridInstance = event && event.detail;
    this.gridObj = this.slickerGridInstance && this.slickerGridInstance.slickGrid;
    this.dataViewObj = this.slickerGridInstance && this.slickerGridInstance.dataView;
  }

  mockDataset() {
    let indent = 0;
    const parents = [];
    const data = [];

    // prepare the data
    for (let i = 0; i < 1000; i++) {
      const d = (data[i] = {});
      let parent;

      if (Math.random() > 0.8 && i > 0) {
        indent++;
        parents.push(i - 1);
      } else if (Math.random() < 0.3 && indent > 0) {
        indent--;
        parents.pop();
      }

      if (parents.length > 0) {
        parent = parents[parents.length - 1];
      } else {
        parent = null;
      }

      d["id"] = "id_" + i;
      d["indent"] = indent;
      d["parent"] = parent;
      d["title"] = "Task " + i;
      d["duration"] = "5 days";
      d["percentComplete"] = Math.round(Math.random() * 100);
      d["start"] = "01/01/2009";
      d["finish"] = "01/05/2009";
      d["effortDriven"] = (i % 5 == 0);
    }
    return data;
  }
}
