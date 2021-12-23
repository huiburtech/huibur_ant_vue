/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
export function saveAs(blob, filename) {
    console.log(blob)
   if (window.navigator.msSaveOrOpenBlob) {
       navigator.msSaveBlob(blob, filename);
   } else {
       const link = document.createElement("a");
       const body = document.querySelector("body");
 
       let url = null;
       if (window.createObjectURL != undefined) {
           // basic
           url = window.createObjectURL(blob);
       } else if (window.webkitURL != undefined) {
           // webkit or chrome
           try {
               url = window.webkitURL.createObjectURL(blob);
           } catch (error) {
               // 
           }
       } else if (window.URL != undefined) {
           // mozilla(firefox)
           try {
               url = window.URL.createObjectURL(blob);
           } catch (error) {
               // 
           }
       }
 
       link.href = url; //window.URL.createObjectURL(blob)
       link.download = filename;
 
       // fix Firefox
       link.style.display = "none";
       body.appendChild(link);
 
       link.click();
       body.removeChild(link);
 
       window.URL.revokeObjectURL(link.href);
   }
}