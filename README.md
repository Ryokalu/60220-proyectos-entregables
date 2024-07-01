# Para la subida de archivos los endopoint son :
-  /api/user/premium/:_id
  En este se deben de subir 3 archivos solo se acepta PDF, para usarlo con postman lo que hice fue crear una key de nombre "files" que es de tipo file y le adjunte los 3 archivos en pdf


- /api/user/:_id/documents
  en este permite la subida de un solo archivo en el cual solo admiten: pdf, jpg, png, dependiendo del tipo de archivo que se entregue se almacenara en su respectiva carpeta


