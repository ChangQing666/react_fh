(function() {
    var _track_conf = _track_conf || [];_track_conf.push(['_page_id','']);//统计容器
    _track_conf.push(['_app_key','NsnUFrRByFBDoQ2TlwXIPcCPCloy9roM']);
    window._track_conf = _track_conf;
    //全站pv埋点统计
    // var _alltrack_conf = _alltrack_conf || [];
    // _alltrack_conf.push(['_allpage_id', 'NsnUFrRByFBDoQ2TlwXIPcCPCloy9roM']);
    // window._alltrack_conf = _alltrack_conf;
    //jq
    var jquery = document.createElement('script'); 
        jquery.type = 'text/javascript';
        jquery.src ='https://static.jyall.com/mobile_f/1.0.0/static/lib/jquery.js';
    document.body.appendChild(jquery);
    setTimeout(function(){
        var pvtrack = document.createElement('script');
            pvtrack.type = 'text/javascript';
            pvtrack.src ='https://app.jyall.com/web-data/swagger/js/trackpv.js';
        document.body.appendChild(pvtrack);
    },1000);
})();
export function track(){
    /*for(let i = document.scripts.length-1; i>0; i--){
        if(document.scripts[i].src.indexOf('track') > 0){
          let scr = document.scripts[i];
          console.log(scr);
          scr.parentNode.removeChild(scr);
        }
    }
    setTimeout(function(){
        var pvtrack = document.createElement('script');
            pvtrack.type = 'text/javascript';
            pvtrack.src ='https://app.jyall.com/web-data/swagger/js/trackpv.js';

        var track = document.createElement('script');
            track.type = 'text/javascript';

            track.src ='https://app.jyall.com/web-data/swagger/js/track.js';

        document.body.appendChild(track);
        document.body.appendChild(pvtrack);
     },1000);*/
}