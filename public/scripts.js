Vue.component('app-grid', {
	template: `<table class='table is-bordered is-striped is-hoverable'>
    <thead>
        <tr class='is-primary'>
            <th v-for='(key, index) in columns' @click='sortBy(key)' :class='{ active: sortKey == key }' class='row-header'>
                <span>{{labels[index]}}</span>
                <span class='arrow' :class='sortOrders[key] > 0 ? "asc" : "dsc"'>
          </span>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for='entry in filteredData'>
            
            <td><a v-bind:href="entry.id">{{ entry.shortStr}}</a></td>
            <td>{{ entry.date }}</td>
            <td>{{ formatCurrency(entry.number) }}</td>
            <td>{{ entry.bool}}</td>
            <td>{{ entry.jsonArr}}</td>
            <td>{{ entry.longStr}}</td>

        </tr>
    </tbody>
</table>`,
	props: {
		data: Array,
		columns: Array,
		labels: Array,
		filterKey: String
	},
	data: function() {
		var sortOrders = {};
		this.columns.forEach(function(key) {
			sortOrders[key] = 1;
		});
		return {
			sortKey: '',
			sortOrders: sortOrders
		};
	},
	computed: {
		filteredData: function() {
			var sortKey = this.sortKey;
			var filterKey = this.filterKey && this.filterKey.toLowerCase();
			var order = this.sortOrders[sortKey] || 1;
			var data = this.data;
			if (filterKey) {
				data = data.filter(function(row) {
					return Object.keys(row).some(function(key) {
						return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
					});
				});
			}
			if (sortKey) {
				data = data.slice().sort(function(a, b) {
					a = a[sortKey];
					b = b[sortKey];
					return (a === b ? 0 : a > b ? 1 : -1) * order;
				});
			}
			return data;
		}
	},
	methods: {
		sortBy: function(key) {
			this.sortKey = key;
			this.sortOrders[key] = this.sortOrders[key] * -1;
		},
		formatCurrency(value, key) {
			if (value != null) {
				return value.toLocaleString('en-US', { style: 'decimal' });
			}
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		searchQuery: '',
		gridColumns: ['shortStr', 'date', 'number','bool', 'jsonArr', 'longStr'],
		gridLabels: ['String Example', 'Date Example', 'Number Example', 'True/False Example', 'JSON Example', 'Long String Example'],
		gridData: data
	},
	methods: {
		fetchFilmData: function() {
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open(
				'GET',
				'MOCK_DATA.json'
			);
			xhr.onload = function() {
				self.gridData = JSON.parse(xhr.responseText);
			};
			xhr.send();
		}
	}
});
app.fetchFilmData();
