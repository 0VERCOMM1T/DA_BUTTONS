import React, { useEffect, useState, useRef } from 'react'
import './index.css'
import { saveButton, getButton, deleteButton, getAllButtons } from './db'

function useButtons() {
  const [buttons, setButtons] = useState({})

  useEffect(() => {
    let mounted = true
    getAllButtons().then(map => mounted && setButtons(map))
    return () => (mounted = false)
  }, [])

  return [buttons, setButtons]
}

function AudioButton({ id, data, onSave, onDelete }) {
  const [playing, setPlaying] = useState(false)
  const [editing, setEditing] = useState(false)
  const [tempLabel, setTempLabel] = useState('')
  const audioRef = useRef(null)
  const audioInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const labelInputRef = useRef(null)

  const label = data?.customLabel || data?.filename || id
  const hasImage = !!data?.image
  const imageURL = hasImage ? URL.createObjectURL(data.image) : null
  const bgColor = !hasImage ? data?.color || '#4b5563' : undefined

  useEffect(() => {
    if (editing && labelInputRef.current) labelInputRef.current.focus()
  }, [editing])

  async function handleAudio(file) {
    const blob = file.slice(0, file.size, file.type)
    await saveButton(id, blob, file.name, null, null, null)
    const saved = await getButton(id)
    onSave(id, saved)
  }

  async function handleImage(file) {
    const imgBlob = file.slice(0, file.size, file.type)
    await saveButton(id, null, null, imgBlob, null, null)
    const saved = await getButton(id)
    onSave(id, saved)
  }

  async function handleRemoveImage(e) {
    e.stopPropagation()
    await saveButton(id, null, null, null, '#4b5563', null)
    const record = await getButton(id)
    record.image = null
    onSave(id, record)
  }

  async function handleColorChange(e) {
    e.stopPropagation()
    const color = e.target.value
    await saveButton(id, null, null, null, color, null)
    const saved = await getButton(id)
    onSave(id, saved)
  }

  async function handleRename(newLabel) {
    await saveButton(id, null, null, null, null, newLabel)
    const saved = await getButton(id)
    onSave(id, saved)
  }

  async function onAudioInput(e) {
    e.stopPropagation()
    const file = e.target.files?.[0]
    if (!file) return
    await handleAudio(file)
    e.target.value = ''
  }

  async function onImageInput(e) {
    e.stopPropagation()
    const file = e.target.files?.[0]
    if (!file) return
    await handleImage(file)
    e.target.value = ''
  }

  async function handlePlayPause() {
    const record = data || (await getButton(id))
    if (!record?.blob) return

    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }

    const url = URL.createObjectURL(record.blob)
    const audio = new Audio(url)
    audioRef.current = audio
    setPlaying(true)
    audio.play()
    audio.addEventListener('ended', () => {
      setPlaying(false)
      URL.revokeObjectURL(url)
    })
  }

  async function handleClear(e) {
    e.stopPropagation()
    audioRef.current?.pause()
    await deleteButton(id)
    onDelete(id)
  }

  function startEditing(e) {
    e.stopPropagation()
    setTempLabel(label)
    setEditing(true)
  }

  async function finishEditing() {
    if (tempLabel.trim() !== label) await handleRename(tempLabel.trim())
    setEditing(false)
  }

  return (
    <div
      className="button-tile"
      style={{
        backgroundImage: hasImage ? `url(${imageURL})` : 'none',
        backgroundColor: bgColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handlePlayPause}
    >
      <div className="overlay">
        <div className="label-row">
          {editing ? (
            <input
              ref={labelInputRef}
              className="edit-input"
              value={tempLabel}
              onChange={e => setTempLabel(e.target.value)}
              onBlur={finishEditing}
              onKeyDown={e => e.key === 'Enter' && finishEditing()}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="label">{label}</span>
              <button
                className="edit-btn"
                onClick={startEditing}
                title="Rename"
              >
                ✏️
              </button>
              {hasImage && (
                <button
                  className="remove-img-btn"
                  onClick={handleRemoveImage}
                  title="Remove image"
                >
                  🗑️ Img
                </button>
              )}
            </>
          )}
        </div>

        <div className="controls">
          <label onClick={e => e.stopPropagation()}>
            🎵
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={onAudioInput}
              style={{ display: 'none' }}
            />
          </label>

          <label onClick={e => e.stopPropagation()}>
            🖼️
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={onImageInput}
              style={{ display: 'none' }}
            />
          </label>

          <input
            type="color"
            onClick={e => e.stopPropagation()}
            onChange={handleColorChange}
            title="Background color"
            value={data?.color || '#4b5563'}
            disabled={hasImage}
            style={{
              opacity: hasImage ? 0.5 : 1,
              cursor: hasImage ? 'not-allowed' : 'pointer',
            }}
          />

          <button onClick={handleClear} title="Delete" className="delete-btn">
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [buttons, setButtons] = useButtons()

  function handleSave(id, saved) {
    setButtons(prev => ({ ...prev, [id]: saved }))
  }

  function handleDelete(id) {
    setButtons(prev => {
      const copy = { ...prev }
      delete copy[id]
      return copy
    })
  }

  async function addButton() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'audio/*'
    input.click()

    input.onchange = async e => {
      const file = e.target.files?.[0]
      if (!file) return
      const id = `button${Date.now()}`
      const blob = file.slice(0, file.size, file.type)
      await saveButton(id, blob, file.name, null, '#4b5563', '')
      const saved = await getButton(id)
      setButtons(prev => ({ ...prev, [id]: saved }))
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🎛️ Custom Audio Buttons</h1>
        <button className="add-btn" onClick={addButton}>
          + Add Button
        </button>
      </header>

      <main>
        <div className="grid">
          {Object.entries(buttons).map(([id, data]) => (
            <AudioButton
              key={id}
              id={id}
              data={data}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
