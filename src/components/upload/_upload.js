import {hx} from '../../common/_tools.js'
import ajax from './_ajax.js'
import instance from '../../common/_instance.js'
import {RFormItem} from '../form/_form';

var RUpload = Vue.extend({
  props: {
    value: Array,
    action: {
      type: String,
      required: true,
    },
    headers: Object,
    data: Object,
    multiple: Boolean,
    name: {
      type: String,
      default: 'name'
    },
    withCredentials: Boolean,
    showUploadList: true,
    accept: String,
    beforeUpload: Function,
    onProcess: Function,
    onSuccess: {
      type: Function,
      required: true,
    },
    onError: Function,
    onPreview: Function,
    onRemove: Function,
    limit: Number,

    // 枚举：file, image
    listType: {
      type: String,
      default: 'file'
    }
  },
  data () {
    return {
      tempFileList: [],
      tempIndex: 1,
    }
  },
  computed: {
    formItem () {
      return instance.getParent(this, RFormItem)
    },
  },
  watch: {
    value () {
      if (this.formItem){
        this.formItem.validate()
      }
    }
  },
  methods: {
    handleClick () {
      this.$refs.input.click()
    },
    handleChange (e) {
      var files = e.target.files
      
      if (!files){
        return
      }

      this.uploadFiles(files)
      this.$refs.input.value = null
    },
    uploadFiles (files) {
      var postFiles = Array.prototype.slice.call(files)
      if (!postFiles.length){
        return
      }

      postFiles.forEach(file => {
        this.upload(file)
      })
    },
    upload (file) {
      if (!this.beforeUpload){
        return this.post(file)
      }

      this.beforeUpload(file, isOk=>{
        if (isOk){
          this.post(file)
        }
      })
    },
    post (file) {
      this.handleStart(file)

      var formData = new FormData
      formData.append(this.name, file)

      ajax({
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: file,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: (e) => {
          this.handleProgress(e, file)
        },
        onSuccess: (res) => {
          this.handleSuccess(res, file)
        },
        onError: (e, res) => {
          this.handleError(e, res, file)
        }
      })
    },
    handleStart (file) {
      file.uid = Date.now() + this.tempIndex ++

      var _file = {
        status: 'uploading',
        name: file.name,
        size: file.size,
        percent: 0,
        uid: file.uid,
      }

      this.tempFileList.push(_file)
    },
    getFile (file) {
      var tempFileList = this.tempFileList
      var target

      tempFileList.some(item => {
        if (item.uid === file.uid){
          target = item
          return true
        }
        else {
          return false
        }
      })

      return target
    },
    handleProgress (e, file) {
      var _file = this.getFile(file)
      
      if (this.onProcess){
        this.onProgress && this.onProgress(e, _file)
      }
      
      _file.percent = e.percent || 0
    },
    handleSuccess (res, file) {
      var tempFileList = this.tempFileList
      var _file = this.getFile(file)

      if (_file){
        _file.status = 'finished'
        _file.response = res

        tempFileList.splice(tempFileList.indexOf(_file), 1)

        if (this.onSuccess){
          this.onSuccess(res, _file)
        }
      }
    },
    handleError (err, res, file) {
      var _file = this.getFile(file)
      var tempFileList = this.tempFileList

      _file.status = 'fail'
      tempFileList.splice(tempFileList.indexOf(_file), 1)
      
      if (this.onError){
        this.onError(err, res, file)
      }
    },
    handleRemove (file) {
      var value = this.value
      value.splice(value.indexOf(file), 1)

      if (this.onRemove){
        this.onRemove(file)
      }
    },
    handlePreview (file){
      if (file.status != 'uploading'){
        this.onPreview(file)
      }
    },

    // list-type: file
    getFileItem (file) {
      var me = this
      var $li = hx('li.r-upload-list-file')
      
      var $name = hx('span', {
        on: {
          click () {
            me.handlePreview(file)
          }
        }
      })
      .push(
        hx('r-icon', {
          props: {
            type: 'document'
          }
        })
      )
      .push(
        hx('span', {}, [file.name])
      )

      var $remove = hx('r-icon.r-upload-list-remove', {
        props: {
          type: 'ios-close-empty'
        },
        nativeOn: {
          click (e) {
            me.handleRemove(file)
          }
        }
      })

      $li.push($name).push($remove)

      if (file.status === 'uploading'){
        var $progress = hx('r-progress', {
          props: {
            percent: file.percent,
            status: 'active',
            strokeWidth: 5
          }
        })
        $li.push($progress)
      }

      return $li
    },

    // list-type: image
    getImageItem (file) {
      var me = this
      var $div = hx('div.r-upload-list-image')

      if (file.status === 'uploading'){
        var $progress = hx('r-progress', {
          props: {
            percent: file.percent,
            status: 'active',
            hideInfo: true,
            strokeWidth: 5
          }
        })

        $div.push($progress)
      }
      else {
        var $image = hx('img', {
          attrs: {
            src: file.url
          }
        })
        var $cover = hx('div.r-upload-list-image-cover')
        .push(
          hx('r-icon', {
            props: {
              type: 'ios-eye'
            },
            nativeOn: {
              click () {
                me.handlePreview(file)
              }
            }
          })
        )
        .push(
          hx('r-icon', {
            props: {
              type: 'ios-trash-outline'
            },
            nativeOn: {
              click () {
                me.handleRemove(file)
              }
            }
          })
        )

        $div.push([$image, $cover])
      }

      return $div
    }
  },
  render (h) {
    var me = this
    var $wrapper = hx('div.r-upload')

    var isShowSelect = true
    if (this.limit){
      if (this.value.length + this.tempFileList.length >= this.limit){
        isShowSelect = false
      }
    }

    // 上传按钮
    if (isShowSelect){
      var $select = hx('div.r-upload-select')
      .push(
        hx('input.r-upload-input', {
          attrs: {
            type: 'file',
            multiple: this.multiple
          },
          on: {
            change (e) {
              me.handleChange(e)
            }
          },
          ref: 'input'
        })
      )
      .push(
        hx('div', {
          style: {

          },
          on: {
            click () {
              me.handleClick()
            }
          }
        }, [this.$slots.default]) 
      )

      $wrapper.push($select)
    }

    // 上传列表
    var listFn = 'getFileItem'

    if (this.listType === 'image'){
      listFn = 'getImageItem'
    }

    var $list = hx('div.r-upload-list')

    var $finishedList = this.value.map(file=>{
      return this[listFn](file)
    })
    
    var $uploadingList = this.tempFileList.map(file=>{
      return this[listFn](file)
    })

    $list.push($finishedList).push($uploadingList)
    $wrapper.push($list)

    return $wrapper.resolve(h)
  }
})

Vue.component('r-upload', RUpload)