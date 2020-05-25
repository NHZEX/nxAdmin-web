import elementResizeDetectorMaker from 'element-resize-detector'

export default function resizeDetectorMaker () {
  const erd = elementResizeDetectorMaker()
  return {
    listenTo: erd.listenTo,
    removeListener: erd.removeListener,
    removeAllListeners: erd.removeAllListeners,
    uninstall: erd.uninstall,
    initDocument: erd.initDocument,
  }
}
