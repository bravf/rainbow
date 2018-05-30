import {hx} from '../../common/_tools'
import ajax from './_ajax'
import instance from '../../common/_instance'
import {RFormItem} from '../form/_form'
import jsx from '../../common/_jsx'

var {div, span, ul, li, rIcon, rProgress, img, input} = jsx

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
      default: 'file'
    },
    withCredentials: Boolean,
    accept: String,
    beforeUpload: Function,
    onProgress: Function,
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
      
      if (this.onProgress){
        this.onProgress(e, _file)
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
          if (! (this.limit && (this.value.length >= this.limit)) ){
            this.onSuccess(res, _file)
          }
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
      if (this.onPreview && (file.status != 'uploading') ){
        this.onPreview(file)
      }
    },

    // list-type: file
    getFileItem (file) {
      var me = this

      return li('.r-upload-list-file',
        // name
        span({
          o_click () {
            me.handlePreview(file)
          }
        },
          rIcon({p_type: 'document'}),
          span(file.name)
        ),
        // remove
        rIcon('.r-upload-list-remove', {
          p_type: 'ios-close-empty',
          no_click (e) {
            me.handleRemove(file)
          }
        }),
        // 进度条
        rProgress({
          vif: file.status === 'uploading',
          p_percent: file.percent,
          p_status: 'active',
          p_strokeWidth: 5
        })
      )
    },

    // list-type: image
    getImageItem (file) {
      var me = this

      return div('.r-upload-list-image',
        file.status === 'uploading' ? 
        // 进度条
        rProgress({
          p_percent: file.percent,
          p_status: 'active',
          p_strokeWidth: 5,
          p_hideInfo: true,
        })
        :
        // 内容
        div(
          img({
            a_src: file.url
          }),
          div('.r-upload-list-image-cover', 
            rIcon({
              p_type: 'ios-eye',
              no_click () {
                me.handlePreview(file)
              }
            }),
            rIcon({
              p_type: 'ios-trash-outline',
              no_click () {
                me.handleRemove(file)
              }
            })
          )
        )
      )
    }
  },
  render (h) {
    jsx.h = h
    var me = this
    var isShowSelect = true

    if (this.limit){
      if (this.value.length + this.tempFileList.length >= this.limit){
        isShowSelect = false
      }
    }

    // 上传类型
    var listFn = 'getFileItem'
    if (this.listType === 'image'){
      listFn = 'getImageItem'
    }


    return div('.r-upload',
      // 上传按钮
      div('.r-upload-select', {vif: isShowSelect},
        input('.r-upload-input', {
          a_type: 'file',
          a_multiple: this.multiple,
          a_accept: this.accept,
          o_change (e) {
            me.handleChange(e)
          },
          ref: 'input'
        }),
        div({
          o_click () {
            me.handleClick()
          }
        }, ...this.$slots.default),
      ),

      // 列表
      div('.r-upload-list', {vif: (this.value.length + this.tempFileList.length) > 0},
        // finished list
        ...this.value.map(file => {
          return this[listFn](file)
        }),
        // uploading list
        ...this.tempFileList.map(file => {
          return this[listFn](file)
        })
      )
    )
  }
})

Vue.component('r-upload', RUpload)