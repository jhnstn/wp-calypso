# Plugin Page Design

The plugins page provides an overview of the available built-in plugins on WordPress.com and a description of available plugin-like upgrades to help users understand the functionality available to them without installing plugins, and to offer the upgrades for premium functionality.

Because the list of plugins is relatively static, it's probably not worth loading data from an API to populate the list of plugins. Although this could be possible, for performance reasons it's best to declare the data at build-time and simply render it instantly.

That being said, it should also be possible to inject a specific list of plugins either from the API or in testing. This panel will thus be composed of plugin data items that can be expressed declaratively as React components or loaded into the state tree through other means.

## Required state data

```js
data = {
  selectedPlugin: // pluginId
  standardPlugins: [
    {
      id: // plugin ID
      title: // String
      icon: // Gridicon slug
      children: // React description of plugin
    }
  ],
  upgradePlugins: [
    {
      id: // plugin ID
      title: // String
      children: // React description of plugin
      href: // link to support page on feature
      isActivated: // bool  
    }
  ]
}
```

## Panel Compilation

The panel displaying the plugins should be composed of a header area explaining the page, a grid of plugins active in general across WordPress.com, and a list of available premium plugin upgrades.

  
```jsx
<PluginPanel>
  <Header />

  <StandardPluginList>
    <StandardPlugin { ...{ id, title, icon } }>
      My description
    </StandardPlugin

    <StandardPlugin { ...{ id, title, icon } }>
      My other description
    </StandardPlugin
  </StandardPluginList>

  <PremiumPluginList>
    <PremiumPlugin { ...{ id, title, href, isActivated } }>
      No Ads! It's great.
    </PremiumPlugin>

    <PremiumPlugin { ...{ id, title, href, isActivated } }>
      Upload videos with ease!
    </PremiumPlugin>
  </PremiumPluginList>
</PluginPanel>
```

## Example Plugin Components

```jsx
<StandardPlugin id={ 15 } title="Example Plugin" icon="star">
  This is the greatest plugin - it's teh bomb.
</StandardPlugin>

<UpgradePlugin
  id={ 23 }
  title="No Ads"
  icon="currency"
  href="http://support.wordpress.com/no-ads"
  isActivated={ false }
>
  Tired of ads showing up? Disable 'em!
</UpgradePlugin>
```
