const DB_NAME = 'itunes_data_v2';
const TABLE_NAME = 'bookmark_table';


export const objectPut = (record) => new Promise(resolve => { 
  
    const request = window.indexedDB.open(DB_NAME, 3);
    
    request.onerror = function(event) {
      console.log('Error opening IndexedDB database');
    };
    
    request.onupgradeneeded = function(event) {
      const db = request.result;
      const objectStore = db.createObjectStore(TABLE_NAME, { keyPath: 'username' });

      objectStore.createIndex('username', 'username', { unique: false });
      objectStore.createIndex('pins', 'pins', { unique: false }); 
 
    };
    
    request.onsuccess = function(event) {

      const db = event.target.result;
      const transaction = db.transaction([TABLE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(TABLE_NAME);
    
      const putRequest = objectStore.put(record);
    
      putRequest.onsuccess = function(event) {
        console.log('Record updated successfully!!!');
      };
    
      putRequest.onerror = function(event) {
        console.log('Error updating record');
      };
    
      transaction.oncomplete = function() {
        db.close();
      };


      console.log('Record added successfully');
      resolve('Record added successfully');
    }; 
  }
);



export const objectGet = (username) => {
  const request = window.indexedDB.open(DB_NAME, 3);

  return new Promise((resolve, reject) => {
    request.onerror = function(event) {
      console.log('Error opening IndexedDB database');
      resolve(event);
    };

    request.onupgradeneeded = function(event) {
      const db = request.result;
      if (!db.objectStoreNames.contains(TABLE_NAME)) {
         const objectStore =db.createObjectStore(TABLE_NAME, { keyPath: 'username' });

         objectStore.createIndex('username', 'username', { unique: false });
         objectStore.createIndex('pins', 'pins', { unique: false }); 
   
      }

    };

    request.onsuccess = function(event) {


      const db = request.result;

      if (!db.objectStoreNames.contains(TABLE_NAME)) {
        console.log  (db)
       return resolve (true)
     }

 

      const transaction = db.transaction([TABLE_NAME], 'readonly');
      const objectStore = transaction.objectStore(TABLE_NAME);
 

      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = function(event) {
        const records = event.target.result; 
        if (!records?.length) resolve (false)
        resolve(records[0]);
      };

      getAllRequest.onerror = function(event) {
        console.log('Error getting all records from object store');
        resolve(event);
      };

 
    };
  });
}


