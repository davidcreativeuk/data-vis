// Create needed constants
const list = document.querySelector('#db-list');
const verbInput = document.querySelector('#verb');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');
const radios = document.querySelector('#verb-options');
const continueBtn = document.querySelector('#chooseVerb');
const verbOutput = document.querySelector('#verb-output');

// create an instance of the db object to store db in
let db;

window.onload = function () {
    // Open our database; it is created if it doesn't already exist
    // (see onupgradeneeded below)
    let request = indexedDB.open('verbs_db', 1);

    // onerror handler signifies that the database didn't open successfully
    request.onerror = function () {
        console.log('Database failed to open');
    };

    // onsuccess handler signifies that the database opened successfully
    request.onsuccess = function () {
        console.log('Database opened successfully');

        // Store the opened database object in the db variable. This is used a lot below
        db = request.result;

        // Run the displayData() function to display the notes already in the IDB
        displayData();
    };
    // Setup the database tables if this has not already been done
    request.onupgradeneeded = function (e) {
        // Grab a reference to the opened database
        let db = e.target.result;

        // Create an objectStore to store our notes in (basically like a single table)
        // including a auto-incrementing key
        let objectStore = db.createObjectStore('verbs_os', { keyPath: 'id', autoIncrement: true });

        // Define what data items the objectStore will contain
        objectStore.createIndex('verb', 'verb', { unique: false });

        console.log('Database setup complete');
    };

    // Create an onsubmit handler so that when the form is submitted the addData() function is run
    form.onsubmit = addData;
    // Define the addData() function
    function addData(e) {
        // prevent default - we don't want the form to submit in the conventional way
        e.preventDefault();

        // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
        let newItem = { verb: verbInput.value };

        // open a read/write db transaction, ready for adding the data
        let transaction = db.transaction(['verbs_os'], 'readwrite');

        // call an object store that's already been added to the database
        let objectStore = transaction.objectStore('verbs_os');

        // Make a request to add our newItem object to the object store
        let request = objectStore.add(newItem);
        request.onsuccess = function () {
            // Clear the form, ready for adding the next entry
            verbInput.value = '';

        };

        // Report on the success of the transaction completing, when everything is done
        transaction.oncomplete = function () {
            console.log('Transaction completed: database modification finished.');

            // update the display of data to show the newly added item, by running displayData() again.
            displayData();
        };

        transaction.onerror = function () {
            console.log('Transaction not opened due to error');
        };
    }
    // Define the displayData() function
    function displayData() {
        // Here we empty the contents of the list element each time the display is updated
        // If you didn't do this, you'd get duplicates listed each time a new note is added
        while (radios.firstChild) {
            radios.removeChild(radios.firstChild);
        }

        // Open our object store and then get a cursor - which iterates through all the
        // different data items in the store
        let objectStore = db.transaction('verbs_os').objectStore('verbs_os');
        objectStore.openCursor().onsuccess = function (e) {
            // Get a reference to the cursor
            let cursor = e.target.result;

            // If there is still another data item to iterate through, keep running this code
            if (cursor) {
                // Create a list item, h3, and p to put each data item inside when displaying it
                // structure the HTML fragment, and append it inside the list
                /* const listItem = document.createElement('li'); */

                /* list.appendChild(listItem); */

                // Put the data from the cursor inside the h3 and para
                /*  listItem.textContent = cursor.value.verb; */


                // Store the ID of the data item inside an attribute on the listItem, so we know
                // which item it corresponds to. This will be useful later when we want to delete items
                /*  listItem.setAttribute('data-note-id', cursor.value.id); */
                var db_id = cursor.value.id;
                var db_value = cursor.value.verb;

                addRadio(db_id, db_value, 'verbs');

                /* // Create a button and place it inside each listItem
                const deleteBtn = document.createElement('button');
                listItem.appendChild(deleteBtn);
                deleteBtn.textContent = 'Delete';

                // Set an event handler so that when the button is clicked, the deleteItem()
                // function is run
                deleteBtn.onclick = deleteItem; */

                // Iterate to the next item in the cursor
                cursor.continue();
            } else {
                // Again, if list item is empty, display a 'No notes stored' message
                /*  if (!radios.firstChild) {
                     const listItem = document.createElement('p');
                     listItem.textContent = 'No notes stored.';
                     radios.appendChild(listItem);}*/
            }
            // if there are no more cursor items to iterate through, say so
            console.log('Notes all displayed');
        }
    }
}
//add listener to continue button to pick up chosen value
continueBtn.addEventListener('click', function(){
 var verbChosen = document.querySelector('input[type=radio][name=verbs]:checked');
 addVerbToSession('verb', verbChosen.value);
})
//add chosen to session storage
function addVerbToSession(id, value) {
    sessionStorage.setItem(id, value);
    //display value
    verbOutput.textContent = value;
}

// buidler for creating radio buttons
function addRadio(id, value, group) {
    //create container
    var div_container = document.createElement('div');
    div_container.classList.add('david-radio__item');
     //create radio input
     var radio_item = document.createElement('input');
     radio_item.classList.add('david-radio__input');
     radio_item.type='radio';
     radio_item.id=value;
     radio_item.name=group;
     radio_item.value=value;
     //create radio label
     var radio_label = document.createElement('label');
     radio_label.classList.add('david-radio__label');
     radio_label.htmlFor = value;
     radio_label.textContent = value;
     //create radio group
     div_container.appendChild(radio_item);
     div_container.appendChild(radio_label);
    //add to fieldset
    radios.appendChild(div_container);
    console.log(value + ' added');
}
// Define the deleteItem() function
function deleteItem(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying to use it with IDB; IDB key
    // values are type-sensitive.
    let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

    // open a database transaction and delete the task, finding it using the id we retrieved above
    let transaction = db.transaction(['notes_os'], 'readwrite');
    let objectStore = transaction.objectStore('notes_os');
    let request = objectStore.delete(noteId);

    // report that the data item has been deleted
    transaction.oncomplete = function () {
        // delete the parent of the button
        // which is the list item, so it is no longer displayed
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        console.log('Note ' + noteId + ' deleted.');

        // Again, if list item is empty, display a 'No notes stored' message
        if (!list.firstChild) {
            let listItem = document.createElement('li');
            listItem.textContent = 'No notes stored.';
            list.appendChild(listItem);
        }
    };
}