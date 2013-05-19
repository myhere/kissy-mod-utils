KISSY.add(function(S) {
  return {
    /**
     * 并行执行异步函数(thread), 每个异步函数接受两个参数, 一个是成功回调
     * 另一个是失败回调函数
     *
     * @param {finishCallback} callback
     * @param {...threadCallback} thread
     */

    /**
     * @callback finishCallback, called when all threads finished.
     * @param {Boolean} whether all threads finished successfully
     *                  任何一个 thread 出错都会为 true
     * @param {Array} 每个元素是对应 threads 的 return 值
     */

    /**
     *
     * @callback threadCallback, 执行函数, 均接受两个毁掉函数
     * @param {Function} thread's success callback with data
     * @param {Function} thread's success callback
     *
     */
    parallel: function(callback, thread) {
      var threads = S.makeArray(arguments).slice(1);

      if (threads.length === 0) {
        callback(true);
        return;
      }

      var total = 0,
          results = [],
          hasError = false;
      S.each(threads, function(thread, idx) {
        ++total;

        thread(
          (function(idx) {
            return function(data) {
              results[idx] = data;
              --total;

              if (total === 0) {
                callback.call(null, false, results);
              }
            }
          })(idx),
          function() {
            callback(true);
        });
      });
    },

    /**
     * 分时依次执行函数, 避免 ui 卡死
     *
     * @param {Array} array to process
     * @param {processCallback} fn, processor
     * @param {Function} [callback], called when all fn is done
     */
    /**
     * @callback processCallback
     * @param {Object} reference the timer id
     */
    process: function(arr, fn, callback) {
      if (arr.length == 0) {
        return;
      }

      var tasks = arr.concat();
      var thread = {
        // id: timer to cancel the process queue
      };

      _process();

      return thread;

      function _process() {
        var s = +new Date(),
            e,
            THRETHOLD = 50,
            INTERVAL = 50;

        do {
          var task = tasks.shift();
          fn(task, thread);
          // 全部执行完
          if (tasks.length === 0) {
            if (S.isFunction(callback)) {
              callback();
            }
            break;
          }
          e = +new Date();

          if (e - s > THRETHOLD) {
            thread.id = setTimeout(function() {
              _process();
            }, INTERVAL);
            S.log('timer id: ' + thread.id);
            break;
          }
        } while(true);
      }
    }
  }
}, {
  attach: false,
  requires: []
});

