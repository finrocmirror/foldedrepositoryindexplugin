$(document).ready(function() {
    var table = document.getElementsByTagName('tbody')[0];

    var collections = {};
    var labels = [];

    // traverse rows backwards as we are removing elements
    for (row = table.rows.length - 1; row >= 0; --row)
    {
        var entry = table.rows[row];
        var name = entry.firstElementChild.firstElementChild.textContent;

        // find category with longest matching string for current entry
        var label = '';
        var matching_string = '';
        for (var key in fri_config)
        {
            var pattern = new RegExp(key);
            var result = name.match(pattern);

            if (result)
            {
                if (matching_string == '' || result[0].length > matching_string.length)
                {
                    matching_string = result[0];
                    label = result[0].replace(pattern, fri_config[key]);
                }
           }
        }

        // category found -> add entry to collection and remove from table
        if (label != '')
        {
            if (!collections[label])
            {
                collections[label] = [];
                labels.push(label);
            }
            collections[label].push(entry);
            table.removeChild(entry);
        }
    }

    // add collected labels to table
    labels = labels.sort();
    for (var i = 0; i < labels.length; ++i)
    {
        var label = labels[i];
        var category = document.createElement('tr');
	category.setAttribute('class', 'even');
        category.innerHTML = '<td class="name" colspan="6"><a class="dir" name="' + i + '" href="#' + i + '" onclick="ToggleCategory('+ i + ')">' + label + '</a></td>';
	table.insertBefore(category, table.lastChild);

        // and add collected entries below their labels
        for (var k = collections[label].length - 1; k >= 0; --k)
        {
            var entry = collections[label][k];
            entry.category = i;
            entry.firstElementChild.style.paddingLeft = '27px';
            entry.style.display = 'none';
            table.insertBefore(entry, table.lastChild);
        }
    }

    var i = 0;
    for (var entry = table.firstElementChild; entry; entry = entry.nextElementSibling)
    {
        if (entry.style.display != 'none')
        {
            entry.setAttribute('class', i++ % 2 ? 'odd' : 'even');
        }
    }
});

function ToggleCategory(category)
{
    var table = document.getElementsByTagName('tbody')[0];
    var i = 0;
    for (var entry = table.firstElementChild; entry; entry = entry.nextElementSibling)
    {
        if (entry.category >= 0)
        {
            if (entry.category == category)
            {
                entry.style.display = entry.style.display == 'none' ? '' : 'none';
            }
            else
            {
                entry.style.display = 'none';
            }
        }
        if (entry.style.display != 'none')
        {
            entry.setAttribute('class', i++ % 2 ? 'odd' : 'even');
        }
    }
}
