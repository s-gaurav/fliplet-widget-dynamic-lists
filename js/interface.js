var DynamicLists = (function() {
  var _this;

  var organizationId = Fliplet.Env.get('organizationId');
  var appName = Fliplet.Env.get('appName');
  var pageTitle = Fliplet.Env.get('pageTitle');
  var listLayout;
  var isLayoutSelected = false;
  var allDataSources = [];
  var newDataSource;
  var newUserDataSource;
  var dataSourceColumns;
  var userDataSourceColumns;
  var resetToDefaults = false;

  var $filterAccordionContainer = $('#filter-accordion');
  var $sortAccordionContainer = $('#sort-accordion');
  var filterPanelTemplate = Fliplet.Widget.Templates['templates.interface.filter-panels'];
  var sortPanelTemplate = Fliplet.Widget.Templates['templates.interface.sort-panels'];

  var tokenField = Fliplet.Widget.Templates['templates.interface.field-token'];

  // ADD NEW MAPPING FOR ALL NEW STYLES THAT ARE ADDED
  var layoutsTemplate = Fliplet.Widget.Templates['templates.interface.layouts'];
  var listLayouts = window.flWidgetLayout;
  var layoutMapping = window.flLayoutMapping;
  
  var baseTemplateEditor;
  var loopTemplateEditor;
  var detailTemplateEditor;
  var filterLoopTemplateEditor;
  var otherLoopTemplateEditor;
  var cssStyleEditor;
  var javascriptEditor;

  var baseTemplateCode = '';
  var loopTemplateCode = '';
  var detailTemplateCode = '';
  var filterLoopTemplateCode = '';
  var otherLoopTemplateCode = '';
  var cssCode = '';
  var jsCode = '';

  var $dataSources = $('#select_datasource');
  var $newUserDataSource = $('#select_user_datasource');
  var defaultSettings = window.flListLayoutConfig;
  var defaultColumns = window.flListLayoutTableColumnConfig;
  var defaultEntries = window.flListLayoutTableConfig;

  // Constructor
  function DynamicLists(configuration) {
    _this = this;

    _this.config = $.extend(true, {
      sortOptions: [],
      filterOptions: [],
      social: {
        likes: false,
        bookmark: false,
        comments: false
      },
      advancedSettings: {}
    }, configuration);
    _this.widgetId = configuration.id;

    $('.layouts-flex').html(layoutsTemplate(listLayouts));

    _this.attachListeners();
    _this.init();
  }

  DynamicLists.prototype = {
    // Public functions
    constructor: DynamicLists,

    attachListeners: function() {
      window.addEventListener('resize', _this.resizeCodeEditors);

      $(document)
        .on('click', '.layout-holder', function() {
          listLayout = $(this).data('layout');
          isLayoutSelected = true;

          $('.state.present').addClass('is-loading');
          // Create data source
          _this.createDataSourceFromLayout()
            .then(function() {
              return _this.loadData();
            })
            .then(function() {
              _this.saveLists(true);
            });
        })
        .on('click', '[data-advanced]', function() {
          _this.goToAdvanced();
        })
        .on('click', '[data-back-settings]', function() {
          _this.goToSettings('advanced');
        })
        .on('click', '#manage-data, [data-edit-datasource]', _this.manageAppData)
        .on('click', '[data-reset-default]', function() {
          var buttonId = $(this).data('id');

          _this.resetToDefaults(buttonId);
        })
        .on('click', '[data-add-sort-panel]', function() {
          var item = {};
          item.id = _this.makeid(8);
          item.title = 'Sort condition ' + ($('#sort-accordion .panel').length + 1);
          item.column = 'Field';
          item.sortBy = 'Sort';
          item.orderBy = 'Order';
          item.columns = dataSourceColumns;
          _this.config.sortOptions.push(item);

          _this.addSortItem(item);
          _this.checkSortPanelLength();
        })
        .on('change', '.sort-panels-holder select', function() {
          var value = $(this).val();
          var type = $(this).data('field');

          if (type === 'field') {
            $(this).parents('.sort-panel').find('.panel-title-text .column').html(value);
          }
          if (type === 'sort') {
            $(this).parents('.sort-panel').find('.panel-title-text .sort-by').html(value);
          }
          if (type === 'order') {
            $(this).parents('.sort-panel').find('.panel-title-text .order-by').html(value);
          }
        })
        .on('click', '[data-add-filter-panel]', function() {
          var item = {};
          item.id = _this.makeid(8);
          item.column = 'Field';
          item.logic = 'Logic';
          item.value = 'Value';
          item.columns = dataSourceColumns;
          _this.config.filterOptions.push(item);

          _this.addFilterItem(item);
          _this.checkFilterPanelLength();
        })
        .on('change', '.filter-panels-holder select', function() {
          var value = $(this).val();
          var type = $(this).data('field');
          var logicMap = {
            '==': 'Equals',
            '!=': 'Doesn\'t equal',
            'contains': 'Contains',
            'notcontain': 'Doesn\'t contain',
            'regex': 'Regex',
            '>': 'Greater than',
            '>=': 'Greater or equal to',
            '<': 'Less than',
            '<=': 'Less or equal to'
          };

          if (type === 'field') {
            $(this).parents('.filter-panel').find('.panel-title-text .column').html(value);
          }
          if (type === 'logic') {
            $(this).parents('.filter-panel').find('.panel-title-text .logic').html(logicMap[value]);
          }
        })
        .on('keyup', '.filter-panels-holder input', function() {
          var value = $(this).val();
          var type = $(this).data('field');

          if (type === 'value') {
            $(this).parents('.filter-panel').find('.panel-title-text .value').html(value);
          }
        })
        .on('click', '.sort-panel .icon-delete', function() {
          var $item = $(this).closest("[data-id], .panel");
          var id = $item.data('id');

          _.remove(_this.config.sortOptions, {
            id: id
          });

          $(this).parents('.panel').remove();
          _this.checkSortPanelLength();
        })
        .on('click', '.filter-panel .icon-delete', function() {
          var $item = $(this).closest("[data-id], .panel");
          var id = $item.data('id');

          _.remove(_this.config.filterOptions, {
            id: id
          });

          $(this).parents('.panel').remove();
          _this.checkFilterPanelLength();
        })
        .on('show.bs.collapse', '.panel-collapse', function() {
          $(this).siblings('.panel-heading').find('.fa-chevron-right').removeClass('fa-chevron-right').addClass('fa-chevron-down');
        })
        .on('hide.bs.collapse', '.panel-collapse', function() {
          $(this).siblings('.panel-heading').find('.fa-chevron-down').removeClass('fa-chevron-down').addClass('fa-chevron-right');
        })
        .on('change', '.advanced-tab input[type="checkbox"]', function() {
          var $input = $(this);
          var inputId = $(this).attr('id');
          var activateWarning = '<p>With this option enabled you will take responsability for maintaining the code. If Fliplet updates the component, those changes might not be applied to your component.<br><strong>You can always revert back to the original components code.</strong></p><p>Are you sure you want to continue?</p>';

          if ( $(this).is(":checked") && !resetToDefaults) {
            Fliplet.Modal.confirm({
              title: 'Important',
              message: activateWarning
            }).then(function (result) {
              if (!result) {
                $input.prop('checked', false);
                return;
              }

              $('.btn[data-id="' + inputId + '"]').removeClass('hidden');
              $('.editor-holder.' + inputId).removeClass('disabled');
              return;
            });
          }

          if ( $(this).is(":checked") && resetToDefaults ) {
            $('.btn[data-id="' + inputId + '"]').removeClass('hidden');
            $('.editor-holder.' + inputId).removeClass('disabled');
            return;
          }

          if ( !$(this).is(":checked") ) {
            $('.btn[data-id="' + inputId + '"]').addClass('hidden');
            $('.editor-holder.' + inputId).addClass('disabled');
            return;
          }
        })
        .on('change', '#enable-search', function() {
          if ( $(this).is(":checked") ) {
            $('.search-fields').removeClass('hidden');
            $('#search-column-fields-tokenfield').tokenfield('update');
          } else {
            $('.search-fields').addClass('hidden');
          }
        })
        .on('change', '#enable-filters', function() {
          if ( $(this).is(":checked") ) {
            $('.filter-fields').removeClass('hidden');
            $('.filter-in-overlay').removeClass('hidden');
            $('#filter-column-fields-tokenfield').tokenfield('update');
          } else {
            $('.filter-fields').addClass('hidden');
            $('#enable-filter-overlay').prop('checked', false);
            $('.filter-in-overlay').addClass('hidden');
          }
        })
        .on('click', '.select-new-data-source', function() {
          Fliplet.Modal.confirm({
            title: 'Changing data source',
            message: '<p>If you select a different data source you will need to use the <strong>Advanced Settings</strong to map your column names on the HTML templates.</p><p>Are you sure you want to continue?</p>'
          }).then(function (result) {
            if (!result) {
              return;
            }
            $('.edit-holder').addClass('hidden');
            $('.select-datasource-holder').removeClass('hidden');
          });
        })
        .on('change', '#enable-comments', function() {
          if ( $(this).is(":checked") ) {
            $('.select-user-datasource-holder').removeClass('hidden');
          } else {
            $('.select-user-datasource-holder').addClass('hidden');
          }
        });

      $dataSources.on( 'change', function() {
        var selectedDataSourceId = $(this).val();

        if (selectedDataSourceId === 'none') {
          return;
        }
        if (selectedDataSourceId === 'new') {
          $('.edit-holder').removeClass('hidden');
          $('.select-datasource-holder').addClass('hidden');
          _this.createDataSource();
          return;
        }
        $('.edit-holder').removeClass('hidden');
        $('.select-datasource-holder').addClass('hidden');
        _this.getColumns(selectedDataSourceId);
      });

      $newUserDataSource.on( 'change', function() {
        var selectedDataSourceId = $(this).val();

        if (selectedDataSourceId === 'none') {
          $('.select-user-firstname-holder').addClass('hidden');
          $('.select-user-lastname-holder').addClass('hidden');
          $('.select-user-email-holder').addClass('hidden');
          $('.select-user-photo-holder').addClass('hidden');
          return;
        }

        _this.getUserColumns(selectedDataSourceId);
      });

      Fliplet.Studio.onMessage(function(event) {
        if (event.data && event.data.event === 'overlay-close' && event.data.data && event.data.data.dataSourceId) {
          _this.reloadDataSources().then(function(dataSources) {
            allDataSources = dataSources;
            _this.initSelect2(allDataSources);
            _this.initSecondSelect2(allDataSources);
            Fliplet.Studio.emit('reload-widget-instance', _this.widgetId);
          });
        }
      });
    },
    manageAppData: function() {
      var dataSourceId = newDataSource.id;

      Fliplet.Studio.emit('overlay', {
        name: 'widget',
        options: {
          size: 'large',
          package: 'com.fliplet.data-sources',
          title: 'Edit Data Sources',
          classes: 'data-source-overlay',
          data: {
            context: 'overlay',
            dataSourceId: dataSourceId
          }
        }
      });
    },
    init: function() {
      _this.getDataSources();
      _this.setupCodeEditors();
      _this.loadData();
      _this.initializeSortSortable();
    },
    loadData: function() {
      setTimeout(function() {
        $('.state').removeClass('loading is-loading');  
      }, 500);

      if (!_this.config.layout) {
        return new Promise(function(resolve) {
          Fliplet.Studio.emit('widget-mode', 'wide');
          resolve();
        });
      } else {
        if (_this.config['style-specific'].length) {
          _.forEach(_this.config['style-specific'], function(item) {
            $('.' + item).removeClass('hidden');
          });
        } else if (_this.config.layout === 'small-card') {
          // Because initial component didn't have this option
          // This makes it backwards compatible
          _this.config['style-specific'] = ['list-filter', 'list-search'];
          _.forEach(_this.config['style-specific'], function(item) {
            $('.' + item).removeClass('hidden');
          });
        }
        // Load data source
        return _this.changeCreateDsButton(_this.config.dataSource)
          .then(function() {
            // Load sort options
            _.forEach(_this.config.sortOptions, function(item) {
              item.fromLoading = true; // Flag to close accordions
              item.columns = dataSourceColumns;
              _this.addSortItem(item);
              $('#sort-accordion #select-data-field-' + item.id).val(item.column);
              $('#sort-accordion #sort-by-field-' + item.id).val(item.sortBy);
              $('#sort-accordion #order-by-field-' + item.id).val(item.orderBy);
            });
            _this.checkSortPanelLength();

            // Load filter options
            _.forEach(_this.config.filterOptions, function(item) {
              item.fromLoading = true; // Flag to close accordions
              item.columns = dataSourceColumns;
              _this.addFilterItem(item);
              $('#filter-accordion #select-data-field-' + item.id).val(item.column);
              $('#filter-accordion #logic-field-' + item.id).val(item.logic);
              $('#filter-accordion #value-field-' + item.id).val(item.value);
            });
            _this.checkFilterPanelLength();

            // Load Search/Filter fields
            $('#enable-search').prop('checked', _this.config.searchEnabled).trigger('change');
            $('#enable-filters').prop('checked', _this.config.filtersEnabled).trigger('change');
            $('#enable-filter-overlay').prop('checked', _this.config.filtersInOverlay).trigger('change');

            // Load social feature
            $('#enable-likes').prop('checked', _this.config.social.likes);
            $('#enable-bookmarks').prop('checked', _this.config.social.bookmark);
            $('#enable-comments').prop('checked', _this.config.social.comments);

            // Select layout
            listLayout = _this.config.layout;
            isLayoutSelected = true;
            $('.layout-holder[data-layout="' + _this.config.layout + '"]').addClass('active');

            // Load code editor tabs
            switch(listLayout) {
              case 'small-card':
                $('.filter-loop-item').removeClass('hidden');
                $('.detail-view-item').removeClass('hidden');
                break;
              case 'news-feed':
                $('.filter-loop-item').removeClass('hidden');
                break;
              case 'feed-comments':
                $('.filter-loop-item').removeClass('hidden');
                break;
              case 'agenda':
                $('.date-loop-item').removeClass('hidden');
                break;
              case 'small-h-card':
                $('.detail-view-item').removeClass('hidden');
                break;
              default:
                break;
            }

            // Load advanced settings
            if (_this.config.advancedSettings.htmlEnabled || _this.config.advancedSettings.cssEnabled || _this.config.advancedSettings.jsEnabled) {
              resetToDefaults = true;
              $('input#enable-templates').prop('checked', _this.config.advancedSettings.htmlEnabled).trigger('change');
              $('input#enable-css').prop('checked', _this.config.advancedSettings.cssEnabled).trigger('change');
              $('input#enable-javascript').prop('checked', _this.config.advancedSettings.jsEnabled).trigger('change');
              resetToDefaults = false;
            }

            _this.setupCodeEditors(listLayout);
            _this.goToSettings('layouts');

            return;
          })
          .then(function() {
            if (_this.config.userDataSourceId) {
              return _this.getUserColumns(_this.config.userDataSourceId);
            }

            return;
          })
          .then(function() {
            if (_this.config.social.comments) {
              $('#select_user_fname').val(_this.config.userFirstNameColumn ? _this.config.userFirstNameColumn : 'none');
              $('#select_user_lname').val(_this.config.userLastNameColumn ? _this.config.userLastNameColumn : 'none');
              $('#select_user_email').val(_this.config.userEmailColumn ? _this.config.userEmailColumn : 'none');
              $('#select_user_photo').val(_this.config.userPhotoColumn ? _this.config.userPhotoColumn : 'none');
              $newUserDataSource.val(_this.config.userDataSourceId ? _this.config.userDataSourceId : 'none').trigger('change');
              $('.select-user-datasource-holder').removeClass('hidden');
            }
          });
      }
    },
    loadTokenFields: function() {
      if (_this.config.searchEnabled) {
        $('#search-column-fields-tokenfield').tokenfield('setTokens', _this.config.searchFields );
      }
      
      if (_this.config.filtersEnabled) {
        $('#filter-column-fields-tokenfield').tokenfield('setTokens', _this.config.filterFields );
      }
    },
    loadUserTokenFields: function() {
      if (_this.config.userNameFields) {
        $('#user-name-column-fields-tokenfield').tokenfield('setTokens', _this.config.userNameFields );
      }
    },
    goToSettings: function(context) {
      if (context === 'advanced') {
        $('.advanced-tab').removeClass('present').addClass('future');
      }
      if (context === 'layouts') {
        $('.settings-tab').removeClass('future').addClass('present');
      }

      Fliplet.Studio.emit('widget-mode', 'normal');
    },
    goToAdvanced: function() {
      $('.advanced-tab').removeClass('future').addClass('present');
      Fliplet.Studio.emit('widget-mode', 'wide');
    },
    setUpTokenFields: function() {
      $('.search-fields').html(tokenField({
        name: 'search-column-fields',
        id: 'search-column-fields-tokenfield'
      }));
      $('#search-column-fields-tokenfield').tokenfield('destroy').tokenfield({
        autocomplete: {
          source: dataSourceColumns,
          delay: 100
        },
        showAutocompleteOnFocus: true
      });
      $('.filter-fields').html(tokenField({
        name: 'filter-column-fields',
        id: 'filter-column-fields-tokenfield'
      }));
      $('#filter-column-fields-tokenfield').tokenfield('destroy').tokenfield({
        autocomplete: {
          source: dataSourceColumns,
          delay: 100
        },
        showAutocompleteOnFocus: true
      });

      _this.loadTokenFields();
    },
    setUpUserTokenFields: function() {
      $('.user-name-fields').html(tokenField({
        name: 'user-name-column-fields',
        id: 'user-name-column-fields-tokenfield'
      }));

      $('#user-name-column-fields-tokenfield').tokenfield('destroy').tokenfield({
        autocomplete: {
          source: userDataSourceColumns,
          delay: 100
        },
        showAutocompleteOnFocus: true
      });

      _this.loadUserTokenFields();
    },
    getColumns: function(dataSourceId) {
      if (dataSourceId && dataSourceId !== '') {
        return Fliplet.DataSources.getById(dataSourceId, {
          cache: false
        }).then(function (dataSource) {
          newDataSource = dataSource;
          dataSourceColumns = dataSource.columns;
          _this.updateFieldsWithColumns(dataSourceColumns);
          return;
        });
      }
    },
    getUserColumns: function(dataSourceId) {
      if (dataSourceId && dataSourceId !== '') {
        return Fliplet.DataSources.getById(dataSourceId, {
          cache: false
        }).then(function (dataSource) {
          newUserDataSource = dataSource;
          userDataSourceColumns = dataSource.columns;
          _this.updateUserFieldsWithColumns(dataSourceColumns);
          return;
        });
      }
    },
    updateFieldsWithColumns: function(dataSourceColumns) {
      var options;
      $('[data-field="field"]').each(function(index, obj) {
        var oldValue = $(obj).val();
        var options = [];
        $(obj).html('');
        $(obj).append('<option value="none">-- Select a data field</option>');
        
        dataSourceColumns.forEach(function(value, index) {
          options.push('<option value="'+ value +'">'+ value +'</option>');
        });
        $(obj).append(options.join(''));
        $(obj).val(oldValue);
      });
      _this.setUpTokenFields();
    },
    updateUserFieldsWithColumns: function(dataSourceColumns) {
      var fOptions = [];
      var lOptions = [];
      var eOptions = [];
      var pOptions = [];

      // Get old values
      var oldFirstNameValue = $('.select-user-firstname-holder select').val();
      var oldLastNameValue = $('.select-user-lastname-holder select').val();
      var oldEmailValue = $('.select-user-email-holder select').val();
      var oldPhotoValue = $('.select-user-photo-holder select').val();

      // Reset
      $('.select-user-firstname-holder select').html('');
      $('.select-user-lastname-holder select').html('');
      $('.select-user-email-holder select').html('');
      $('.select-user-photo-holder select').html('');

      // Append options
      // First Name
      $('.select-user-firstname-holder select').append('<option value="none">-- Select the first name data field</option>');
      $('.select-user-firstname-holder select').append('<option disabled>------</option>');
      userDataSourceColumns.forEach(function(value, index) {
        fOptions.push('<option value="'+ value +'">'+ value +'</option>');
      });
      $('.select-user-firstname-holder select').append(fOptions.join(''));
      $('.select-user-firstname-holder select').val(oldFirstNameValue);

      // Last Name
      $('.select-user-lastname-holder select').append('<option value="none">-- Select the last name data field</option>');
      $('.select-user-lastname-holder select').append('<option disabled>------</option>');
      userDataSourceColumns.forEach(function(value, index) {
        lOptions.push('<option value="'+ value +'">'+ value +'</option>');
      });
      $('.select-user-lastname-holder select').append(lOptions.join(''));
      $('.select-user-lastname-holder select').val(oldLastNameValue);

      // Email
      $('.select-user-email-holder select').append('<option value="none">-- Select the email data field</option>');
      $('.select-user-email-holder select').append('<option disabled>------</option>');
      userDataSourceColumns.forEach(function(value, index) {
        eOptions.push('<option value="'+ value +'">'+ value +'</option>');
      });
      $('.select-user-email-holder select').append(eOptions.join(''));
      $('.select-user-email-holder select').val(oldEmailValue);

      // Photo
      $('.select-user-photo-holder select').append('<option value="none">-- Select the photo data field</option>');
      $('.select-user-photo-holder select').append('<option disabled>------</option>');
      userDataSourceColumns.forEach(function(value, index) {
        pOptions.push('<option value="'+ value +'">'+ value +'</option>');
      });
      $('.select-user-photo-holder select').append(pOptions.join(''));
      $('.select-user-photo-holder select').val(oldPhotoValue);

      // Show select fields
      $('.select-user-firstname-holder').removeClass('hidden');
      $('.select-user-lastname-holder').removeClass('hidden');
      $('.select-user-email-holder').removeClass('hidden');
      $('.select-user-photo-holder').removeClass('hidden');

      _this.setUpUserTokenFields();
    },
    reloadDataSources: function(dataSourceId) {
      return Fliplet.DataSources.get({
        roles: 'publisher,editor',
        type: null
      }, {
        cache: false
      });
    },
    formatState: function(state) {
      if (state.id === 'none') {
        return $(
          '<span class="select2-value-holder">' + state.text + '</span>'
        );
      }
      if (state.id === 'new') {
        return $(
          '<span class="select2-value-holder">' + state.text + '</span>'
        );
      }
      if (state.id === '------') {
        return $(
          '<span class="select2-value-holder">' + state.text + '</span>'
        );
      }
      if (typeof state.name === 'undefined' && typeof state.text !== 'undefined') {
        return $(
          '<span class="select2-value-holder">' + state.text + ' <small>ID: ' + state.id + '</small></span>'
        );
      }

      return $(
        '<span class="select2-value-holder">' + state.name + ' <small>ID: ' + state.id + '</small></span>'
      );
    },
    customDsSearch: function(params, data) {
      // If there are no search terms, return all of the data
      if ($.trim(params.term) === '') {
        return data;
      }

      // Do not display the item if there is no 'text' property
      if (typeof data.text === 'undefined' || typeof data.name === 'undefined') {
        return null;
      }

      var name = data.name.toLowerCase();
      var term = params.term.toLowerCase();
      if (name.indexOf(term) > -1) {
        var modifiedData = $.extend({}, data, true);

        // You can return modified objects from here
        // This includes matching the `children` how you want in nested data sets
        return modifiedData;
      }

      // Return `null` if the term should not be displayed
      return null;
    },
    initSelect2: function(dataSources) {
      $dataSources.select2({
        data: dataSources,
        placeholder: '-- Select a data source',
        templateResult: _this.formatState,
        templateSelection: _this.formatState,
        width: '100%',
        matcher: _this.customDsSearch,
        dropdownAutoWidth: true
      });
    },
    initSecondSelect2: function(dataSources) {
      $newUserDataSource.select2({
        data: dataSources,
        placeholder: '-- Select a data source',
        templateResult: _this.formatState,
        templateSelection: _this.formatState,
        width: '100%',
        matcher: _this.customDsSearch,
        dropdownAutoWidth: true
      });
    },
    getDataSources: function() {
      // Load the data source
      Fliplet.DataSources.get({
        roles: 'publisher,editor',
        type: null
      }, {
        cache: false
      }).then(function (dataSources) {
        var options = [];
        allDataSources = dataSources;
        _this.initSelect2(allDataSources);
        _this.initSecondSelect2(allDataSources);
      });
    },
    createDataSource: function() {
      event.preventDefault();
      Fliplet.Modal.prompt({
        title: 'Please type a name for your data source:',
        value: appName + ' - ' + layoutMapping[listLayout].name
      }).then(function (name) {
        if (name === null) {
          $dataSources.val('none').trigger('change');
          return;
        }

        if (name === '') {
          $dataSources.val('none').trigger('change');
          alert('You must enter a data source name');
          return;
        }

        Fliplet.DataSources.create({
          name: name,
          organizationId: organizationId,
          entries: defaultEntries[listLayout],
          columns: defaultColumns[listLayout],
          definition: {'bundleImages': true}
        }).then(function(ds) {
          allDataSources.push(ds);

          var newOption = new Option(ds.name, ds.id, true, true);
          $dataSources.append(newOption).trigger('change');
          _this.getColumns(ds.id);
        });
      });   
    },
    createDataSourceFromLayout: function() {
      var name = appName + ' - List - ' + layoutMapping[listLayout].name;

      return Fliplet.DataSources.create({
        name: name,
        organizationId: organizationId,
        entries: defaultEntries[listLayout],
        columns: defaultColumns[listLayout],
        definition: {'bundleImages': true}
      }).then(function(ds) {
        allDataSources.push(ds);
        _this.config.layout = listLayout;
        _this.config.dataSource = ds;
        _this.config.dataSourceId = ds.id;
        _this.config = $.extend(true, _this.config, defaultSettings[listLayout]);

        return ds;
      });
    },
    changeCreateDsButton: function(dataSource) {
      newDataSource = dataSource;
      return _this.getColumns(dataSource.id)
        .then(function() {
          $('.selected-datasource span').html(dataSource.name);
          $('.create-holder').addClass('hidden');
          $('.edit-holder').removeClass('hidden');
          $('.form-group').removeClass('disabled');
        });
    },
    checkSortPanelLength: function() {
      if ($('#sort-accordion .panel').length) {
        $('.sort-panels-holder').removeClass('empty');
      } else {
        $('.sort-panels-holder').addClass('empty');
      }
    },
    checkFilterPanelLength: function() {
      if ($('#filter-accordion .panel').length) {
        $('.filter-panels-holder').removeClass('empty');
      } else {
        $('.filter-panels-holder').addClass('empty');
      }
    },
    makeid: function(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },
    addSortItem: function(data) {
      var $newPanel = $(sortPanelTemplate(data));
      $sortAccordionContainer.append($newPanel);
    },
    addFilterItem: function(data) {
      var $newPanel = $(filterPanelTemplate(data));
      $filterAccordionContainer.append($newPanel);
    },
    initializeSortSortable: function() {
      $('#sort-accordion').sortable({
        handle: ".panel-heading",
        cancel: ".icon-delete",
        tolerance: 'pointer',
        revert: 150,
        placeholder: 'panel panel-default placeholder tile',
        cursor: '-webkit-grabbing; -moz-grabbing;',
        axis: 'y',
        start: function(event, ui) {
          var itemId = $(ui.item).data('id');

          $('.panel-collapse.in').collapse('hide');
          ui.item.addClass('focus').css('height', ui.helper.find('.panel-heading').outerHeight() + 2);
          $('.panel').not(ui.item).addClass('faded');
        },
        stop: function(event, ui) {
          var itemId = $(ui.item).data('id');
          var movedItem = _.find(_this.config.sortOptions, function(item) {
            return item.id === itemId;
          });

          ui.item.removeClass('focus');

          var sortedIds = $("#sort-accordion").sortable("toArray", {
            attribute: 'data-id'
          });
          _this.config.sortOptions = _.sortBy(_this.config.sortOptions, function(item) {
            return sortedIds.indexOf(item.id);
          });
          $('.panel').not(ui.item).removeClass('faded');
        },
        sort: function(event, ui) {
          $('#sort-accordion').sortable('refresh');
        }
      });
    },
    initializeFilterSortable: function() {
      $('#filter-accordion').sortable({
        handle: ".panel-heading",
        cancel: ".icon-delete",
        tolerance: 'pointer',
        revert: 150,
        placeholder: 'panel panel-default placeholder tile',
        cursor: '-webkit-grabbing; -moz-grabbing;',
        axis: 'y',
        start: function(event, ui) {
          var itemId = $(ui.item).data('id');

          $('.panel-collapse.in').collapse('hide');
          ui.item.addClass('focus').css('height', ui.helper.find('.panel-heading').outerHeight() + 2);
          $('.panel').not(ui.item).addClass('faded');
        },
        stop: function(event, ui) {
          var itemId = $(ui.item).data('id');
          var movedItem = _.find(_this.config.filterOptions, function(item) {
            return item.id === itemId;
          });

          ui.item.removeClass('focus');

          var sortedIds = $("#filter-accordion").sortable("toArray", {
            attribute: 'data-id'
          });
          _this.config.filterOptions = _.sortBy(_this.config.filterOptions, function(item) {
            return sortedIds.indexOf(item.id);
          });
          $('.panel').not(ui.item).removeClass('faded');
        },
        sort: function(event, ui) {
          $('#filter-accordion').sortable('refresh');
        }
      });
    },
    getSelectedRange: function(editor) {
      return {
        from: editor.getCursor(true),
        to: editor.getCursor(false)
      }
    },
    autoFormatSelection: function(editor) {
      if (editor && typeof editor === 'boolean') {
        if (baseTemplateEditor) {
          var totalLinesBaseTemplateEditor = baseTemplateEditor.lineCount()
          var totalCharsBaseTemplateEditor = baseTemplateEditor.getTextArea().value.length
          baseTemplateEditor.autoFormatRange(
            { line: 0, ch: 0 },
            { line: totalLinesBaseTemplateEditor, ch: totalCharsBaseTemplateEditor }
          )
          // Remove selection
          baseTemplateEditor.setSelection(
            { line: 0, ch: 0 },
            { line: 0, ch: 0 }
          )
        }

        if (loopTemplateEditor) {
          var totalLinesLoopTemplateEditor = loopTemplateEditor.lineCount()
          var totalCharsLoopTemplateEditor = loopTemplateEditor.getTextArea().value.length
          loopTemplateEditor.autoFormatRange(
            { line: 0, ch: 0 },
            { line: totalLinesLoopTemplateEditor, ch: totalCharsLoopTemplateEditor }
          )
          // Remove selection
          loopTemplateEditor.setSelection(
            { line: 0, ch: 0 },
            { line: 0, ch: 0 }
          )
        }

        if (detailTemplateEditor) {
          var totalLinesDetailTemplateEditor = detailTemplateEditor.lineCount()
          var totalCharsDetailTemplateEditor = detailTemplateEditor.getTextArea().value.length
          otherLoopTemplateEditor.autoFormatRange(
            { line: 0, ch: 0 },
            { line: totalLinesDetailTemplateEditor, ch: totalCharsDetailTemplateEditor }
          )
          // Remove selection
          detailTemplateEditor.setSelection(
            { line: 0, ch: 0 },
            { line: 0, ch: 0 }
          )
        }

        if (filterLoopTemplateEditor) {
          var totalLinesFilterLoopTemplateEditor = filterLoopTemplateEditor.lineCount()
          var totalCharsFilterLoopTemplateEditor = filterLoopTemplateEditor.getTextArea().value.length
          otherLoopTemplateEditor.autoFormatRange(
            { line: 0, ch: 0 },
            { line: totalLinesFilterLoopTemplateEditor, ch: totalCharsFilterLoopTemplateEditor }
          )
          // Remove selection
          filterLoopTemplateEditor.setSelection(
            { line: 0, ch: 0 },
            { line: 0, ch: 0 }
          )
        }

        if (otherLoopTemplateEditor) {
          var totalLinesOtherLoopTemplateEditor = otherLoopTemplateEditor.lineCount()
          var totalCharsOtherLoopTemplateEditor = otherLoopTemplateEditor.getTextArea().value.length
          otherLoopTemplateEditor.autoFormatRange(
            { line: 0, ch: 0 },
            { line: totalLinesOtherLoopTemplateEditor, ch: totalCharsOtherLoopTemplateEditor }
          )
          // Remove selection
          otherLoopTemplateEditor.setSelection(
            { line: 0, ch: 0 },
            { line: 0, ch: 0 }
          )
        }

        if (cssStyleEditor) {
          var totalLinesCssStyleEditor = cssStyleEditor.lineCount()
          var totalCharsCssStyleEditor = cssStyleEditor.getTextArea().value.length
          cssStyleEditor.autoFormatRange(
            { line: 0, ch: 0 },
            { line: totalLinesCssStyleEditor, ch: totalCharsCssStyleEditor }
          )
          // Remove selection
          cssStyleEditor.setSelection(
            { line: 0, ch: 0 },
            { line: 0, ch: 0 }
          )
        }

        if (javascriptEditor) {
          var totalLinesJavascriptEditor = javascriptEditor.lineCount()
          var totalCharsJavascriptEditor = javascriptEditor.getTextArea().value.length
          javascriptEditor.autoFormatRange(
            { line: 0, ch: 0 },
            { line: totalLinesJavascriptEditor, ch: totalCharsJavascriptEditor }
          )
          // Remove selection
          javascriptEditor.setSelection(
            { line: 0, ch: 0 },
            { line: 0, ch: 0 }
          )
        }
        return
      }

      const range = _this.getSelectedRange(editor)
      editor.autoFormatRange(range.from, range.to)
      // Remove selection
      editor.setSelection(
        { line: 0, ch: 0 },
        { line: 0, ch: 0 }
      )
    },
    commentSelection: function(editor) {
      var range = _this.getSelectedRange(editor)
      editor.commentRange(true, range.from, range.to)
    },
    removeCommentSelection: function(editor) {
      var range = _this.getSelectedRange(editor)
      editor.commentRange(false, range.from, range.to)
    },
    codeMirrorConfig: function(mode) {
      return {
        mode: {
          name: mode
        },
        lineNumbers: true,
        autoRefresh: true,
        lineWrapping: true,
        tabSize: 2,
        matchBrackets: true,
        styleActiveLine: true,
        foldGutter: true,
        gutters: ['CodeMirror-lint-markers', 'CodeMirror-foldgutter'],
        extraKeys: {
          'Cmd-B': _this.autoFormatSelection,
          'Cmd-/': _this.commentSelection,
          'Cmd-;': _this.removeCommentSelection,
          'Ctrl-/': _this.commentSelection,
          'Ctrl-;': _this.removeCommentSelection
        }
      }
    },
    getCodeEditorData: function(selectedLayout, fromReset) {
      var basePromise = new Promise(function(resolve) {
        var baseTemplateCompiler;
        if (layoutMapping[selectedLayout] && layoutMapping[selectedLayout].base) {
          baseTemplateCompiler = Fliplet.Widget.Templates[layoutMapping[selectedLayout].base];
        }
        if (_this.config.advancedSettings.htmlEnabled && typeof _this.config.advancedSettings.baseHTML !== 'undefined') {
          baseTemplateCode = !fromReset ? _this.config.advancedSettings.baseHTML : baseTemplateEditor.getValue();
        } else if (typeof baseTemplateCompiler !== 'undefined') {
          baseTemplateCode = baseTemplateCompiler();
        } else {
          baseTemplateCode = '';
        }

        resolve();
      });

      var loopPromise = new Promise(function(resolve) {
        var loopTemplateCompiler;
        if (layoutMapping[selectedLayout] && layoutMapping[selectedLayout].loop) {
          loopTemplateCompiler = Fliplet.Widget.Templates[layoutMapping[selectedLayout].loop];
        }
        if (_this.config.advancedSettings.htmlEnabled && typeof _this.config.advancedSettings.loopHTML !== 'undefined') {
          loopTemplateCode = !fromReset ? _this.config.advancedSettings.loopHTML : loopTemplateEditor.getValue();
        } else if (typeof loopTemplateCompiler !== 'undefined') {
          loopTemplateCode = loopTemplateCompiler();
        } else {
          loopTemplateCode = '';
        }

        resolve();
      });

      var detailPromise = new Promise(function(resolve) {
        var detailTemplateCompiler;
        if (layoutMapping[selectedLayout] && layoutMapping[selectedLayout].detail) {
          detailTemplateCompiler = Fliplet.Widget.Templates[layoutMapping[selectedLayout].detail];
        }
        if (_this.config.advancedSettings.htmlEnabled && typeof _this.config.advancedSettings.detailHTML !== 'undefined') {
          detailTemplateCode = !fromReset ? _this.config.advancedSettings.detailHTML : detailTemplateEditor.getValue();
        } else if (typeof detailTemplateCompiler !== 'undefined') {
          detailTemplateCode = detailTemplateCompiler();
        } else {
          detailTemplateCode = '';
        }

        resolve();
      });

      var filterLoopPromise = new Promise(function(resolve) {
        var filterLoopTemplateCompiler;
        if (layoutMapping[selectedLayout] && layoutMapping[selectedLayout].filter) {
          filterLoopTemplateCompiler = Fliplet.Widget.Templates[layoutMapping[selectedLayout].filter];
        }
        if (_this.config.advancedSettings.htmlEnabled && typeof _this.config.advancedSettings.filterHTML !== 'undefined') {
          filterLoopTemplateCode = !fromReset ? _this.config.advancedSettings.filterHTML : filterLoopTemplateEditor.getValue();
        } else if (typeof filterLoopTemplateCompiler !== 'undefined') {
          filterLoopTemplateCode = filterLoopTemplateCompiler();
        } else {
          filterLoopTemplateCode = '';
        }

        resolve();
      });

      var otherLoopPromise = new Promise(function(resolve) {
        var otherLoopTemplateCompiler;
        if (layoutMapping[selectedLayout] && layoutMapping[selectedLayout]['other-loop']) {
          otherLoopTemplateCompiler = Fliplet.Widget.Templates[layoutMapping[selectedLayout]['other-loop']];
        }
        if (_this.config.advancedSettings.htmlEnabled && typeof _this.config.advancedSettings.otherLoopHTML !== 'undefined') {
          otherLoopTemplateCode = !fromReset ? _this.config.advancedSettings.otherLoopHTML : otherLoopTemplateEditor.getValue();
        } else if (typeof otherLoopTemplateCompiler !== 'undefined') {
          otherLoopTemplateCode = otherLoopTemplateCompiler();
        } else {
          otherLoopTemplateCode = '';
        }

        resolve();
      });

      if (_this.config.advancedSettings.cssEnabled && typeof _this.config.advancedSettings.cssCode !== 'undefined') {
        cssCode = !fromReset ? _this.config.advancedSettings.cssCode : cssStyleEditor.getValue();
      } else if (layoutMapping[selectedLayout] && layoutMapping[selectedLayout].css) {
        var cssUrl = $('[data-' + layoutMapping[selectedLayout].css + '-css-url]').data(layoutMapping[selectedLayout].css + '-css-url');
        var cssPromise = Fliplet.API.request('v1/communicate/proxy/' + cssUrl).then(function(response) {
          cssCode = response;
          return;
        });
      }

      if (_this.config.advancedSettings.jsEnabled && typeof _this.config.advancedSettings.jsCode !== 'undefined') {
        jsCode = !fromReset ? _this.config.advancedSettings.jsCode : javascriptEditor.getValue();
      } else if (layoutMapping[selectedLayout] && layoutMapping[selectedLayout].js) {
        var jsUrl = $('[data-' + layoutMapping[selectedLayout].js + '-js-url]').data(layoutMapping[selectedLayout].js + '-js-url');
        var jsPromise = Fliplet.API.request('v1/communicate/proxy/' + jsUrl )
          .then(function(response) {
            jsCode = response;
          });
      }

      return Promise.all([basePromise, loopPromise, detailPromise, filterLoopPromise, otherLoopPromise, cssPromise, jsPromise]);
    },
    setupCodeEditors: function(selectedLayout, fromReset) {
      var baseTemplate = document.getElementById('base-template');
      var baseTemplateType = $(baseTemplate).data('type');
      var loopTemplate = document.getElementById('loop-template');
      var loopTemplateType = $(loopTemplate).data('type');
      var detailTemplate = document.getElementById('detail-view-template');
      var detailTemplateType = $(detailTemplate).data('type');
      var filterLoopTemplate = document.getElementById('filter-loop-template');
      var filterLoopTemplateType = $(filterLoopTemplate).data('type');
      var otherLoopTemplate = document.getElementById('other-loop-template');
      var otherLoopTemplateType = $(otherLoopTemplate).data('type');
      var cssStyle = document.getElementById('css-styles');
      var cssStyleType = $(cssStyle).data('type');
      var javascript = document.getElementById('js-code');
      var javascriptType = $(javascript).data('type');

      _this.getCodeEditorData(selectedLayout, fromReset).then(function() {
        var baseTemplatePromise = new Promise(function(resolve) {
          if (baseTemplateEditor) {
            baseTemplateEditor.getDoc().setValue(baseTemplateCode);
          } else if (baseTemplate) {
            baseTemplateEditor = CodeMirror.fromTextArea(
              baseTemplate,
              _this.codeMirrorConfig(baseTemplateType)
            );
          }

          if (baseTemplateEditor) {
            resolve();
          }
        });

        var loopTemplatePromise = new Promise(function(resolve) {
          if (loopTemplateEditor) {
            loopTemplateEditor.getDoc().setValue(loopTemplateCode);
          } else if (loopTemplate) {
            loopTemplateEditor = CodeMirror.fromTextArea(
              loopTemplate,
              _this.codeMirrorConfig(loopTemplateType)
            );
          }

          if (loopTemplateEditor) {
            resolve();
          }
        });

        var detailTemplatePromise = new Promise(function(resolve) {
          if (detailTemplateEditor) {
            detailTemplateEditor.getDoc().setValue(detailTemplateCode);
          } else if (detailTemplate) {
            detailTemplateEditor = CodeMirror.fromTextArea(
              detailTemplate,
              _this.codeMirrorConfig(detailTemplateType)
            );
          }

          if (detailTemplateEditor) {
            resolve();
          }
        });

        var filterLoopTemplatePromise = new Promise(function(resolve) {
          if (filterLoopTemplateEditor) {
            filterLoopTemplateEditor.getDoc().setValue(filterLoopTemplateCode);
          } else if (filterLoopTemplate) {
            filterLoopTemplateEditor = CodeMirror.fromTextArea(
              filterLoopTemplate,
              _this.codeMirrorConfig(filterLoopTemplateType)
            );
          }

          if (filterLoopTemplateEditor) {
            resolve();
          }
        });

        var otherLoopTemplatePromise = new Promise(function(resolve) {
          if (otherLoopTemplateEditor) {
            otherLoopTemplateEditor.getDoc().setValue(otherLoopTemplateCode);
          } else if (otherLoopTemplate) {
            otherLoopTemplateEditor = CodeMirror.fromTextArea(
              otherLoopTemplate,
              _this.codeMirrorConfig(otherLoopTemplateType)
            );
          }

          if (otherLoopTemplateEditor) {
            resolve();
          }
        });

        var cssStylePromise = new Promise(function(resolve) {
          if (cssStyleEditor) {
            cssStyleEditor.getDoc().setValue(cssCode);
          } else if (cssStyle) {
            cssStyleEditor = CodeMirror.fromTextArea(
              cssStyle,
              _this.codeMirrorConfig(cssStyleType)
            );
          }

          if (cssStyleEditor) {
            resolve();
          }
        });

        var javascriptPromise = new Promise(function(resolve) {
          if (javascriptEditor) {
            javascriptEditor.getDoc().setValue(jsCode);
          } else if (cssStyle) {
            javascriptEditor = CodeMirror.fromTextArea(
              javascript,
              _this.codeMirrorConfig(javascriptType)
            );
          }

          if (javascriptEditor) {
            resolve();
          }
        });

        Promise.all([baseTemplatePromise, loopTemplatePromise, detailTemplatePromise, filterLoopTemplatePromise, otherLoopTemplatePromise, cssStylePromise, javascriptPromise])
          .then(function() {
            _this.resizeCodeEditors();
          });
      });
    },
    resizeCodeEditors: function() {
      var baseContentHeight = $('.action-control-holder').outerHeight(true) + $('.advanced-tabs-level-one').outerHeight(true) + $('.advanced-tabs-level-two').outerHeight(true);
      var contentHeight = $('.action-control-holder').outerHeight(true) + $('.advanced-tabs-level-one').outerHeight(true);
      var containerHeight = $('.advanced-tab .state-wrapper').height();
      var baseDiff = (containerHeight - baseContentHeight) / 1;
      var diff = (containerHeight - contentHeight) / 1;

      setTimeout(function() {
        $('#templates .CodeMirror').each(function(idx, el) {
          $(el).css({
            'height': baseDiff
          });
        });
        $('#css .CodeMirror, #javascript .CodeMirror').each(function(idx, el) {
          $(el).css({
            'height': diff
          });
        });
      }, 1);
    },
    resetToDefaults: function(id) {
      Fliplet.Modal.confirm({
        title: 'Reset to default',
        message: '<p>You will lose all the changes you made.<p>Are you sure you want to continue?</p>'
      }).then(function (result) {
        if (!result) {
          return;
        }

        resetToDefaults = true;
        // Uncheck checkbox
        $('input#' + id).prop('checked', false).trigger('change');
        // Reset settings
        if (id === 'enable-templates') {
          _this.config.advancedSettings.baseHTML = undefined;
          _this.config.advancedSettings.loopHTML = undefined;

          switch(listLayout) {
            case 'small-card':
              _this.config.advancedSettings.filterHTML = undefined;
              _this.config.advancedSettings.detailHTML = undefined;
              break;
            case 'news-feed':
              _this.config.advancedSettings.filterHTML = undefined;
              break;
            case 'feed-comments':
              _this.config.advancedSettings.filterHTML = undefined;
              break;
            case 'agenda':
              _this.config.advancedSettings.otherLoopHTML = undefined;
              break;
            case 'small-h-card':
              _this.config.advancedSettings.detailHTML = undefined;
              break;
            default:
              break;
          }

          _this.config.advancedSettings.htmlEnabled = false;
        } 
        if (id === 'enable-css') {
          _this.config.advancedSettings.cssCode = undefined;
          _this.config.advancedSettings.cssEnabled = false;
        } 
        if (id === 'enable-javascript') {
          _this.config.advancedSettings.jsCode = undefined;
          _this.config.advancedSettings.jsEnabled = false;
        } 
        // Update codeeditor
        _this.setupCodeEditors(listLayout, true);
        resetToDefaults = false;
      });
    },
    saveLists: function(toReload) {
      var likesPromise;
      var bookmarksPromise;
      var commentsPromise;
      var data = _this.config;
      data.advancedSettings = {};

      data.layout = listLayout;
      data.dataSource = newDataSource;
      data.dataSourceId = newDataSource.id;

      // Get sorting options
      _.forEach(_this.config.sortOptions, function(item) {
        item.column = $('#sort-accordion #select-data-field-' + item.id).val();
        item.sortBy = $('#sort-accordion #sort-by-field-' + item.id).val();
        item.orderBy = $('#sort-accordion #order-by-field-' + item.id).val();
      });

      // Get filter options
      _.forEach(_this.config.filterOptions, function(item) {
        item.column = $('#filter-accordion #select-data-field-' + item.id).val();
        item.logic = $('#filter-accordion #logic-field-' + item.id).val();
        item.value = $('#filter-accordion #value-field-' + item.id).val();
      });

      data.sortOptions = _this.config.sortOptions;
      data.filterOptions = _this.config.filterOptions;

      // Get search and filter
      data.searchEnabled = $('#enable-search').is(":checked");
      data.filtersEnabled = $('#enable-filters').is(":checked");
      data.searchFields = typeof $('#search-column-fields-tokenfield').val() !== 'undefined' ?
        $('#search-column-fields-tokenfield').val().split(',').map(function(x){ return x.trim(); }) : [];
      data.filterFields = typeof $('#filter-column-fields-tokenfield').val()  !== 'undefined' ?
        $('#filter-column-fields-tokenfield').val().split(',').map(function(x){ return x.trim(); }) : [];
      data.filtersInOverlay = $('#enable-filter-overlay').is(":checked");

      // Advanced Settings
      var advancedInUse;
      data.advancedSettings.htmlEnabled = $('input#enable-templates').is(":checked");
      data.advancedSettings.cssEnabled = $('input#enable-css').is(":checked");
      data.advancedSettings.jsEnabled = $('input#enable-javascript').is(":checked");
      
      if (data.advancedSettings.htmlEnabled) {
        data.advancedSettings.loopHTML = loopTemplateEditor.getValue();
        data.advancedSettings.baseHTML = baseTemplateEditor.getValue();

        switch(listLayout) {
          case 'small-card':
            data.advancedSettings.detailHTML = detailTemplateEditor.getValue();
            data.advancedSettings.filterHTML = filterLoopTemplateEditor.getValue();
            break;
          case 'news-feed':
            data.advancedSettings.filterHTML = filterLoopTemplateEditor.getValue();
            break;
          case 'feed-comments':
            data.advancedSettings.filterHTML = filterLoopTemplateEditor.getValue();
            break;
          case 'agenda':
            data.advancedSettings.otherLoopHTML = otherLoopTemplateEditor.getValue();
            break;
          case 'small-h-card':
            data.advancedSettings.detailHTML = detailTemplateEditor.getValue();
            break;
          default:
            break;
        }
      }

      if (data.advancedSettings.cssEnabled) {
        data.advancedSettings.cssCode = cssStyleEditor.getValue();
      }

      if (data.advancedSettings.jsEnabled) {
        data.advancedSettings.jsCode = javascriptEditor.getValue();
      }

      // Get social feature
      _this.config.social.bookmark = $('#enable-bookmarks').is(":checked");
      _this.config.social.comments = $('#enable-comments').is(":checked");
      _this.config.social.likes = $('#enable-likes').is(":checked");

      data.social = _this.config.social;

      if (_this.config.social.comments) {
        data.userDataSource = newUserDataSource;
        data.userDataSourceId = newUserDataSource ? newUserDataSource.id : $newUserDataSource.val();
        data.userNameFields = typeof $('#user-name-column-fields-tokenfield').val()  !== 'undefined' ?
        $('#user-name-column-fields-tokenfield').val().split(',').map(function(x){ return x.trim(); }) : [];
        data.userEmailColumn = $('#select_user_email').val();
        data.userPhotoColumn = $('#select_user_photo').val();
      }

      if (_this.config.social.likes && (!_this.config.likesDataSourceId || _this.config.likesDataSourceId === '')) {
        // Create likes data source
        likesPromise = Fliplet.DataSources.create({
          name: appName + ' - Likes',
          organizationId: organizationId // optional
        }).then(function (dataSource) {
          _this.config.likesDataSourceId = dataSource.id;
        });
      } else if (!_this.config.social.likes && _this.config.likesDataSourceId) {
        _this.config.likesDataSourceId = '';
      }
      if (_this.config.social.bookmark && (!_this.config.bookmarkDataSourceId || _this.config.bookmarkDataSourceId === '')) {
        // Create likes data source
        bookmarksPromise = Fliplet.DataSources.create({
          name: appName + ' - Bookmarks',
          organizationId: organizationId // optional
        }).then(function (dataSource) {
          _this.config.bookmarkDataSourceId = dataSource.id;
        });
      } else if (!_this.config.social.bookmark && _this.config.bookmarkDataSourceId) {
        _this.config.bookmarkDataSourceId = '';
      }
      if (_this.config.social.comments && (!_this.config.commentsDataSourceId || _this.config.commentsDataSourceId === '')) {
        // Create likes data source
        commentsPromise = Fliplet.DataSources.create({
          name: appName + ' - Comments',
          organizationId: organizationId // optional
        }).then(function (dataSource) {
          _this.config.commentsDataSourceId = dataSource.id;
        });
      } else if (!_this.config.social.comments && _this.config.commentsDataSourceId) {
        _this.config.commentsDataSourceId = '';
      }

      if (toReload) {
        return Promise.all([likesPromise, bookmarksPromise, commentsPromise])
          .then(function() {
            _this.config = data;

            Fliplet.Widget.save(_this.config).then(function () {
              Fliplet.Studio.emit('reload-widget-instance', _this.widgetId);
            });

            return;
          });
      }

      _this.config = data;
      return Promise.all([likesPromise, bookmarksPromise, commentsPromise]);
    }
  }

  return DynamicLists;
})();