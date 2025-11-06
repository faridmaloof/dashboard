/**
 * Página de demostración de componentes UI
 * Muestra todos los componentes disponibles con ejemplos y todas sus variantes
 */

import { useState } from 'react'
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Checkbox,
  CheckboxGroup,
  Divider,
  Dropdown,
  Input,
  ListBox,
  ListGroup,
  Modal,
  PhoneInput,
  ProgressBar,
  MultiProgressBar,
  RadioGroup,
  SectionHeader,
  Select,
  Spinner,
  ProgressSpinner,
  LogoSpinner,
  Switch,
  Tabs,
  Textarea,
  Tooltip,
} from '@/components/ui'
import { SearchModal } from '@/components/layout/SearchModal'
import { 
  UserIcon, 
  HomeIcon, 
  CogIcon, 
  BellIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import type { BreadcrumbItem, DropdownItem, ListBoxOption, ListGroupItem, RadioOption, TabItem } from '@/components/ui'

export default function ComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [checkboxGroupValue, setCheckboxGroupValue] = useState<string[]>([])
  const [radioValue, setRadioValue] = useState('option1')
  const [dropdownValue, setDropdownValue] = useState('')
  const [listBoxValue, setListBoxValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Componentes', href: '/components' },
    { label: 'UI', href: '/components/ui' },
    { label: 'Demo' },
  ]

  // Dropdown items
  const dropdownItems: DropdownItem[] = [
    { label: 'Perfil', value: 'profile', icon: UserIcon },
    { label: 'Configuración', value: 'settings', icon: CogIcon },
    { label: 'Notificaciones', value: 'notifications', icon: BellIcon },
    { divider: true, label: '', value: 'divider' },
    { label: 'Cerrar sesión', value: 'logout' },
  ]

  // ListBox options
  const listBoxOptions: ListBoxOption[] = [
    {
      id: '1',
      label: 'Usuario Premium',
      description: 'Acceso completo a todas las funciones',
      icon: StarIcon,
    },
    {
      id: '2',
      label: 'Usuario Estándar',
      description: 'Acceso a funciones básicas',
      icon: UserIcon,
    },
    {
      id: '3',
      label: 'Usuario Gratuito',
      description: 'Acceso limitado',
      icon: UserIcon,
      disabled: true,
    },
  ]

  // ListGroup items
  const listGroupItems: ListGroupItem[] = [
    { id: '1', content: 'Inicio', icon: HomeIcon, badge: '5', active: true },
    { id: '2', content: 'Configuración', icon: CogIcon },
    { id: '3', content: 'Notificaciones', icon: BellIcon, badge: 12 },
    { id: '4', content: 'Favoritos', icon: HeartIcon },
  ]

  // Radio options
  const radioOptions: RadioOption[] = [
    { value: 'option1', label: 'Opción 1', description: 'Esta es la primera opción' },
    { value: 'option2', label: 'Opción 2', description: 'Esta es la segunda opción' },
    { value: 'option3', label: 'Opción 3', disabled: true },
  ]

  // Checkbox options
  const checkboxOptions = [
    { value: 'option1', label: 'Opción 1', description: 'Primera opción' },
    { value: 'option2', label: 'Opción 2', description: 'Segunda opción' },
    { value: 'option3', label: 'Opción 3' },
  ]

  // Tabs
  const tabs: TabItem[] = [
    {
      id: 'tab1',
      label: 'General',
      icon: HomeIcon,
      content: <div className="p-4">Contenido de la pestaña General</div>,
    },
    {
      id: 'tab2',
      label: 'Configuración',
      icon: CogIcon,
      content: <div className="p-4">Contenido de Configuración</div>,
    },
    {
      id: 'tab3',
      label: 'Notificaciones',
      icon: BellIcon,
      content: <div className="p-4">Contenido de Notificaciones</div>,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Biblioteca de Componentes UI
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Colección completa de componentes modernos y reutilizables con soporte para modo oscuro y animaciones fluidas
        </p>
      </div>

      <Divider />

      {/* Breadcrumb */}
      <section>
        <SectionHeader 
          title="Breadcrumb" 
          subtitle="Navegación de migas de pan con múltiples estilos"
        />
        <Card>
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <Breadcrumb items={breadcrumbItems} separator="slash" showHome={false} />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Alerts */}
      <section>
        <SectionHeader 
          title="Alerts" 
          subtitle="Alertas con 4 variantes de color y opción de cierre"
        />
        <div className="space-y-4">
          <Alert variant="success" title="¡Éxito!">
            La operación se completó correctamente.
          </Alert>
          <Alert variant="error" title="Error" onClose={() => {}}>
            Ocurrió un error al procesar la solicitud.
          </Alert>
          <Alert variant="warning">
            Esta acción no se puede deshacer.
          </Alert>
          <Alert variant="info">
            Tienes 3 notificaciones nuevas.
          </Alert>
        </div>
      </section>

      {/* Buttons */}
      <section>
        <SectionHeader 
          title="Buttons & Button Groups" 
          subtitle="Botones con múltiples variantes y grupos de botones"
        />
        <Card>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <ButtonGroup>
              <Button>Izquierda</Button>
              <Button>Centro</Button>
              <Button>Derecha</Button>
            </ButtonGroup>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Avatars */}
      <section>
        <SectionHeader 
          title="Avatars" 
          subtitle="Avatares con tamaños, estados y grupos de usuarios"
        />
        <Card>
          <div className="flex items-center gap-4">
            <Avatar name="Juan Pérez" size="xs" status="online" />
            <Avatar name="María García" size="sm" status="away" />
            <Avatar name="Pedro López" size="md" status="busy" />
            <Avatar name="Ana Martínez" size="lg" />
            <Avatar name="Carlos Rodríguez" size="xl" shape="square" />
          </div>
          <div className="mt-4">
            <AvatarGroup
              avatars={[
                { name: 'Usuario 1' },
                { name: 'Usuario 2' },
                { name: 'Usuario 3' },
                { name: 'Usuario 4' },
                { name: 'Usuario 5' },
              ]}
              max={3}
            />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Spinners */}
      <section>
        <SectionHeader 
          title="Spinners" 
          subtitle="Indicadores de carga con múltiples estilos y animaciones"
        />
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Spinners Estándar
            </h3>
            <div className="flex gap-8 items-center">
              <Spinner variant="circle" size="sm" />
              <Spinner variant="dots" size="md" />
              <Spinner variant="bars" size="lg" />
              <Spinner variant="pulse" size="md" />
              <ProgressSpinner progress={75} size="md" />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Logo Spinners - Con Marca FaruTech
            </h3>
            <div className="flex gap-8 items-center flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="spin" speed="slow" size="sm" />
                <p className="text-xs text-gray-500">Spin Slow</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="spin" speed="normal" size="md" />
                <p className="text-xs text-gray-500">Spin Normal</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="spin" speed="fast" size="lg" />
                <p className="text-xs text-gray-500">Spin Fast</p>
              </div>
            </div>
            
            <Divider />
            
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 mt-4">
              Flip 3D Vertical (Moneda)
            </h3>
            <div className="flex gap-8 items-center flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flip" speed="slow" size="sm" />
                <p className="text-xs text-gray-500">Flip Vertical Slow</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flip" speed="normal" size="md" />
                <p className="text-xs text-gray-500">Flip Vertical Normal</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flip" speed="fast" size="lg" />
                <p className="text-xs text-gray-500">Flip Vertical Fast</p>
              </div>
            </div>
            
            <Divider />
            
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 mt-4">
              Flip 3D Horizontal (Moneda Completa)
            </h3>
            <div className="flex gap-8 items-center flex-wrap">
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flipHorizontal" speed="slow" size="sm" />
                <p className="text-xs text-gray-500">Flip Horizontal Slow</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flipHorizontal" speed="normal" size="md" />
                <p className="text-xs text-gray-500">Flip Horizontal Normal</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LogoSpinner variant="flipHorizontal" speed="fast" size="lg" />
                <p className="text-xs text-gray-500">Flip Horizontal Fast</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Divider />

      {/* Progress Bars */}
      <section>
        <SectionHeader 
          title="Progress Bars" 
          subtitle="Barras de progreso simples y múltiples con variantes animadas"
        />
        <Card>
          <div className="space-y-4">
            <ProgressBar value={30} label="Progreso básico" showLabel />
            <ProgressBar value={60} variant="gradient" color="success" />
            <ProgressBar value={80} variant="striped" color="warning" />
            <MultiProgressBar
              items={[
                { label: 'Completado', value: 40, color: 'success' },
                { label: 'En progreso', value: 30, color: 'warning' },
                { label: 'Pendiente', value: 30, color: 'error' },
              ]}
            />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Form Controls */}
      <section>
        <SectionHeader 
          title="Form Controls" 
          subtitle="Controles de formulario completos: inputs, selects, checkboxes, radios y más"
        />
        <Card>
          <div className="space-y-6">
            <Input label="Nombre" placeholder="Ingresa tu nombre" />
            <Textarea label="Descripción" placeholder="Escribe una descripción" />
            <PhoneInput
              label="Teléfono"
              value={phoneValue}
              onChange={setPhoneValue}
            />
            <Select
              label="País"
              options={[
                { label: 'México', value: 'mx' },
                { label: 'España', value: 'es' },
                { label: 'Colombia', value: 'co' },
              ]}
            />
            <Switch
              checked={switchValue}
              onChange={setSwitchValue}
              label="Recibir notificaciones"
              description="Te enviaremos actualizaciones por correo"
            />
            <Checkbox
              checked={checkboxValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckboxValue(e.target.checked)}
              label="Acepto los términos y condiciones"
            />
            <CheckboxGroup
              label="Intereses"
              options={checkboxOptions}
              value={checkboxGroupValue}
              onChange={setCheckboxGroupValue}
            />
            <RadioGroup
              label="Selecciona una opción"
              options={radioOptions}
              value={radioValue}
              onChange={setRadioValue}
              variant="card"
            />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Dropdowns & ListBox */}
      <section>
        <SectionHeader 
          title="Dropdowns & ListBox" 
          subtitle="Menús desplegables y listas seleccionables con iconos y descripciones"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Dropdown
            label="Menú desplegable"
            items={dropdownItems}
            value={dropdownValue}
            onChange={setDropdownValue}
            placeholder="Selecciona una opción"
          />
          <ListBox
            label="Lista con imágenes"
            options={listBoxOptions}
            value={listBoxValue}
            onChange={(value) => {
              if (typeof value === 'string') {
                setListBoxValue(value)
              }
            }}
            placeholder="Selecciona un tipo de usuario"
          />
        </div>
      </section>

      <Divider />

      {/* ListGroup */}
      <section>
        <SectionHeader 
          title="List Groups" 
          subtitle="Listas interactivas con 3 variantes de estilo"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ListGroup items={listGroupItems} variant="default" />
          <ListGroup items={listGroupItems} variant="flush" />
          <ListGroup items={listGroupItems} variant="bordered" />
        </div>
      </section>

      <Divider />

      {/* Tabs */}
      <section>
        <SectionHeader 
          title="Tabs" 
          subtitle="Pestañas con iconos en variantes underline y pills"
        />
        <Card>
          <Tabs tabs={tabs} defaultTab="tab1" />
          <div className="mt-4">
            <Tabs tabs={tabs} variant="pills" />
          </div>
        </Card>
      </section>

      <Divider />

      {/* Carousel */}
      <section>
        <SectionHeader 
          title="Carousel" 
          subtitle="Carrusel de imágenes con autoplay y controles de navegación"
        />
        <Carousel className="h-64" autoPlay interval={5000}>
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            Slide 1
          </div>
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
            Slide 2
          </div>
          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
            Slide 3
          </div>
        </Carousel>
      </section>

      <Divider />

      {/* Tooltips */}
      <section>
        <SectionHeader 
          title="Tooltips" 
          subtitle="Tooltips con posicionamiento en 4 direcciones y tipos"
        />
        <Card>
          <div className="space-y-6">
            {/* Posiciones */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Posiciones</h4>
              <div className="flex gap-4 flex-wrap">
                <Tooltip content="Tooltip arriba" position="top">
                  <Button>Hover Top</Button>
                </Tooltip>
                <Tooltip content="Tooltip abajo" position="bottom">
                  <Button>Hover Bottom</Button>
                </Tooltip>
                <Tooltip content="Tooltip izquierda" position="left">
                  <Button>Hover Left</Button>
                </Tooltip>
                <Tooltip content="Tooltip derecha" position="right">
                  <Button>Hover Right</Button>
                </Tooltip>
              </div>
            </div>

            <Divider />

            {/* Tipos con iconos */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tipos (con iconos)</h4>
              <div className="flex gap-4 flex-wrap">
                <Tooltip content="Información útil" type="info" showIcon>
                  <Button variant="secondary">
                    <InformationCircleIcon className="w-4 h-4" />
                    Info
                  </Button>
                </Tooltip>
                <Tooltip content="¡Operación exitosa!" type="success" showIcon>
                  <Button variant="success">
                    <CheckCircleIcon className="w-4 h-4" />
                    Success
                  </Button>
                </Tooltip>
                <Tooltip content="Ten cuidado con esta acción" type="warning" showIcon>
                  <Button>
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    Warning
                  </Button>
                </Tooltip>
                <Tooltip content="Error al procesar" type="error" showIcon>
                  <Button variant="danger">
                    <XCircleIcon className="w-4 h-4" />
                    Error
                  </Button>
                </Tooltip>
                <Tooltip content="Tooltip por defecto" type="default">
                  <Button variant="secondary">Default</Button>
                </Tooltip>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Modal */}
      <section>
        <SectionHeader 
          title="Modal" 
          subtitle="Ventanas modales con overlay y animaciones suaves"
        />
        <Button onClick={() => setIsModalOpen(true)}>Abrir Modal</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Modal de ejemplo"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Este es un ejemplo de modal con contenido personalizado.
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Aceptar</Button>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
          </div>
        </Modal>
      </section>

      <Divider />

      {/* Badges */}
      <section>
        <SectionHeader 
          title="Badges" 
          subtitle="Etiquetas de estado con 5 variantes de color"
        />
        <Card>
          <div className="flex gap-2">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </Card>
      </section>

      <Divider />

      {/* Search Modal */}
      <section>
        <SectionHeader 
          title="Search Modal" 
          subtitle="Buscador global con navegación por teclado (⌘K o Ctrl+K)"
        />
        <Card>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modal de búsqueda con resultados agrupados por categorías, soporte para múltiples fuentes de datos y atajos de teclado.
            </p>
            <Button onClick={() => setIsSearchModalOpen(true)}>
              Abrir Buscador (o presiona ⌘K)
            </Button>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>✨ Características:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>Navegación con teclado (↑↓ Enter Esc)</li>
                <li>Resultados agrupados por categorías</li>
                <li>Headers no clicleables como separadores</li>
                <li>Soporte para API externa o datos locales</li>
                <li>Búsqueda con debounce automático</li>
              </ul>
            </div>
          </div>
        </Card>
        <SearchModal 
          isOpen={isSearchModalOpen} 
          onClose={() => setIsSearchModalOpen(false)} 
        />
      </section>

      <Divider />

      {/* Logo Spinner Mejorado */}
      <section>
        <SectionHeader 
          title="Logo Spinner" 
          subtitle="Spinner del logo con múltiples variantes y opción de inversión de colores"
        />
        <Card>
          <div className="space-y-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Animación mejorada con opción de invertir colores a mitad del giro. 
              La inversión mantiene la ilusión visual en logos diagonales tipo "S cursiva".
            </p>
            
            {/* Con inversión de colores */}
            <div>
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
                ✨ Con Inversión de Colores (invertColors=true)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Secuencia: <span className="font-mono">Positivo (0°) → Negativo (180°) → Positivo (360°)</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Spin 2D</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="spin" size="lg" speed="normal" invertColors={true} />
                  </div>
                  <p className="text-xs text-gray-500">Rotación 2D con inversión</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=true
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Vertical</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flip" size="lg" speed="normal" invertColors={true} />
                  </div>
                  <p className="text-xs text-gray-500">Flip vertical con inversión</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=true
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Horizontal</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flipHorizontal" size="lg" speed="normal" invertColors={true} />
                  </div>
                  <p className="text-xs text-gray-500">Flip horizontal con inversión</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=true
                  </code>
                </div>
              </div>
            </div>

            <Divider />

            {/* Sin inversión de colores */}
            <div>
              <h4 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-4">
                🎨 Sin Inversión de Colores (invertColors=false)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Animación normal sin cambios de color. El logo mantiene sus colores originales durante todo el giro.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Spin 2D</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="spin" size="lg" speed="normal" invertColors={false} />
                  </div>
                  <p className="text-xs text-gray-500">Rotación 2D normal</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=false
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Vertical</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flip" size="lg" speed="normal" invertColors={false} />
                  </div>
                  <p className="text-xs text-gray-500">Flip vertical normal</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=false
                  </code>
                </div>

                <div className="text-center space-y-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Flip 3D Horizontal</h5>
                  <div className="flex justify-center py-4">
                    <LogoSpinner variant="flipHorizontal" size="lg" speed="normal" invertColors={false} />
                  </div>
                  <p className="text-xs text-gray-500">Flip horizontal normal</p>
                  <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                    invertColors=false
                  </code>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Velocidades (con inversión)</h4>
              <div className="flex justify-around">
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="slow" invertColors />
                  <p className="text-xs text-gray-500">Lento (2s)</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Normal (1.5s)</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="fast" invertColors />
                  <p className="text-xs text-gray-500">Rápido (1s)</p>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tamaños</h4>
              <div className="flex justify-around items-end">
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="sm" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Small</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="md" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Medium</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="lg" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Large</p>
                </div>
                <div className="text-center space-y-2">
                  <LogoSpinner variant="spin" size="xl" speed="normal" invertColors />
                  <p className="text-xs text-gray-500">Extra Large</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
