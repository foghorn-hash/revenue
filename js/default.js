Ext.require(['Ext.data.*']);
Ext.require('Ext.chart.*');
Ext.require(['Ext.Window', 'Ext.layout.container.Fit', 'Ext.fx.target.Sprite', 'Ext.window.MessageBox']);

Ext.onReady(function () {
	
	Ext.define('Transactions', {
		extend: 'Ext.data.Model',
		fields: [{name: 'saleDate'}
				, {name: 'vendorAmount', type:'float'}
				, {name: 'balanceVendor', type:'float'}]
	});

	var store = Ext.create('Ext.data.Store', {
		model: 'Transactions',
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url : './chart.php',
			reader: {
				type: 'json',
				root: 'root'
			}
		}
	});
	
	Ext.define('Year', {
		extend: 'Ext.data.Model',
		fields: [{name: 'saleYear'}
				, {name: 'balanceVendor', type:'float'}]
	});

	var storeYear = Ext.create('Ext.data.Store', {
		model: 'Year',
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url : './year.php',
			reader: {
				type: 'json',
				root: 'root'
			}
		}
	});
	
	Ext.define('Pie', {
		extend: 'Ext.data.Model',
		fields: [{name: 'saleYear'}
				, {name: 'balanceVendor', type:'float'}]
	});

	var storePie = Ext.create('Ext.data.Store', {
		model: 'Pie',
		autoLoad: true,
		proxy: {
			type: 'ajax',
			url : './year.php',
			reader: {
				type: 'json',
				root: 'root'
			}
		}
	});
	
    var chart1 = Ext.create('Ext.chart.Chart', {
            title:'Transactions (All dates)',
			style: 'background:#fff',
            animate: true,
            shadow: true,
            store: store,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['vendorAmount'],
                label: {
                    //renderer: Ext.util.Format.numberRenderer('0,0')
                },
                title: 'Revenue in USD',
                grid: true
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['saleDate'],
                title: 'Day',
				label   : {
				 rotate:{degrees:270}
				}
            }],
            series: [{
                type: 'column',
                axis: 'left',
                highlight: true,
                label: {
                  display: 'insideEnd',
                  'text-anchor': 'middle',
                    field: 'vendorAmount',
                    //renderer: Ext.util.Format.numberRenderer('0,0'),
                    orientation: 'vertical',
                    color: '#33f'
                },
                xField: 'saleDate',
                yField: 'vendorAmount'
            }]
        });
		
		var chart2 = Ext.create('Ext.chart.Chart', {
            title:'Total Revenue (All dates)',
			style: 'background:#fff',
            animate: true,
            shadow: true,
            store: store,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['balanceVendor'],
                label: {
                    //renderer: Ext.util.Format.numberRenderer('0,0')
                },
                title: 'Business Win in USD since first date',
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['saleDate'],
                title: 'Day',
				label   : {
				 rotate:{degrees:270}
				}
            }],
            series: [{
                type: 'column',
                axis: 'left',
                highlight: true,
                label: {
					display: 'insideEnd',
                  'text-anchor': 'middle',
                    field: 'balanceVendor',
                    orientation: 'vertical',
                    color: '#33f'
                },
                xField: 'saleDate',
                yField: 'balanceVendor'
            }]
        });
		
		var chart3 = Ext.create('Ext.chart.Chart', {
            title:'Total Revenue per Year',
			style: 'background:#fff',
            animate: true,
            shadow: true,
            store: storeYear,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['balanceVendor'],
                label: {
                    //renderer: Ext.util.Format.numberRenderer('0,0')
                },
                title: 'Total Reveneue per Year',
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['saleYear'],
                title: 'Year',
				label   : {
				 rotate:{degrees:270}
				}
            }],
            series: [{
                type: 'column',
                axis: 'left',
                highlight: true,
                label: {
                  display: 'insideEnd',
                  'text-anchor': 'middle',
                    field: 'balanceVendor',
                    //renderer: Ext.util.Format.numberRenderer('0,0'),
                    orientation: 'vertical',
                    color: '#33f'
                },
                xField: 'saleYear',
                yField: 'balanceVendor'
            }]
        });
		
		var donut = false, 
		    chart4 = Ext.create('Ext.chart.Chart', {
			title: 'Revenue Persentages',
            xtype: 'chart',
            animate: true,
            store: storePie,
            shadow: true,
            legend: {
                position: 'right'
            },
            insetPadding: 60,
            theme: 'Base:gradients',
            series: [{
                type: 'pie',
                field: 'balanceVendor',
                showInLegend: true,
                donut: donut,
                tips: {
                  trackMouse: true,
                  width: 140,
                  height: 28,
                  renderer: function(storeItem, item) {
                    //calculate percentage.
                    var total = 0;
                    storePie.each(function(rec) {
                        total += rec.get('balanceVendor');
                    });
                    this.setTitle(storeItem.get('saleYear') + ': ' + Math.round(storeItem.get('balanceVendor') / total * 100) + '%');
                  }
                },
                highlight: {
                  segment: {
                    margin: 20
                  }
                },
                label: {
                    field: 'saleYear',
                    display: 'rotate',
                    contrast: true,
                    font: '18px Arial'
                }
            }]
        });
		
		Ext.create('Ext.container.Viewport', {
			layout: 'border',
			items: [{
				region: 'center',
				xtype: 'tabpanel', // TabPanel itself has no title
				activeTab: 0,      // First tab active by default
				items: [
					chart1,
					chart2,
					chart3,
					chart4
				]
			}]
		});
});